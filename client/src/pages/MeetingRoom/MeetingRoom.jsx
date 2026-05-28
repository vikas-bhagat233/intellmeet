import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import VideoPlayer from '../../components/meeting/VideoPlayer';
import MeetingControls from '../../components/meeting/MeetingControls';
import ParticipantList from '../../components/meeting/ParticipantList';
import Peer from 'simple-peer';
import MeetingAI from './MeetingAI';
import CollaborationDashboard from './CollaborationDashboard';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function MeetingRoom() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user, token } = useAuth();

  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [isMuted, setIsMuted] = useState(true); // default OFF
  const [isVideoOff, setIsVideoOff] = useState(true); // default OFF
  const peersRef = useRef({});
  const handlersRef = useRef(null);
  const localStreamRef = useRef(null);    // original camera stream — peers were created with this
  const currentStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const isScreenSharingRef = useRef(false);
  const sentVideoTrackRef = useRef(null); // the track currently being sent to peers via RTP

  const isMutedRef = useRef(true);
  const isVideoOffRef = useRef(true);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    isVideoOffRef.current = isVideoOff;
  }, [isVideoOff]);

  // Utility to get the stream that should be sent to peers (screen if sharing, else camera)
  const getCurrentSendingStream = () => {
    if (isScreenSharingRef.current && screenStreamRef.current) return screenStreamRef.current;
    if (localStreamRef.current) return localStreamRef.current;
    if (currentStreamRef.current) return currentStreamRef.current;
    return new MediaStream();
  };

  // Meeting states
  const [meeting, setMeeting] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [startTime] = useState(Date.now());

  // Screen share & recording states
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  // Tracks whether the HOST is sharing their screen (used by participant side)
  const [hostScreenSharing, setHostScreenSharing] = useState(false);
  // Sync currentStreamRef on each render
  useEffect(() => {
    currentStreamRef.current = stream;
  }, [stream]);

  // Keep a mutable ref in sync so long-lived socket handlers always see the latest state.
  useEffect(() => {
    isScreenSharingRef.current = isScreenSharing;
  }, [isScreenSharing]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Fetch meeting details to check host permissions
  useEffect(() => {
    axios.get(`/api/meetings/${meetingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const m = response.data?.data?.meeting;
        if (m) {
          setMeeting(m);
          const hostId = m.host?._id || m.host;
          const currentUserId = user?._id || user?.id;
          
          const isUserHost = 
            (hostId && currentUserId && hostId.toString() === currentUserId.toString()) ||
            (m.hostName && user?.name && m.hostName.toLowerCase() === user.name.toLowerCase()) ||
            (m.host?.email && user?.email && m.host.email.toLowerCase() === user.email.toLowerCase()) ||
            (m.hostEmail && user?.email && m.hostEmail.toLowerCase() === user.email.toLowerCase());
            
          if (isUserHost) {
            setIsHost(true);
          }
        }
      })
      .catch(console.error);
  }, [meetingId, token, user]);

  const getIsUserHost = (dbUserIdToCheck, usernameToCheck) => {
    if (!meeting) return false;
    const hostId = meeting.host?._id || meeting.host;
    const currentUserId = dbUserIdToCheck;
    
    return (
      (hostId && currentUserId && hostId.toString() === currentUserId.toString()) ||
      (meeting.host?.name && usernameToCheck && meeting.host.name.toLowerCase() === usernameToCheck.toLowerCase()) ||
      (meeting.host?.email && usernameToCheck && meeting.host.email.toLowerCase() === usernameToCheck.toLowerCase())
    );
  };

  // ICE server config – public STUN required for cross-network WebRTC
  const iceConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  // createPeer: called by EXISTING users when a NEW user joins. Always initiates.

  // Use the current stream (screen or camera) for new peers
  const createPeer = (userToSignal, callerId) => {
    const peer = new Peer({ initiator: true, trickle: false, stream: getCurrentSendingStream(), config: iceConfig });

    peer.on('signal', signal => {
      socket.emit('sending-signal', { userId: userToSignal, signal, callerId });
    });

    peer.on('stream', remoteStream => {
      setPeers(prev => prev.map(p => p.userId === userToSignal ? { ...p, stream: remoteStream } : p));
    });

    peer.on('error', err => console.error('Peer error:', err));
    peer.on('close', () => console.log('Peer closed:', userToSignal));

    return peer;
  };

  const addPeer = (incomingSignal, callerId) => {
    const peer = new Peer({ initiator: false, trickle: false, stream: getCurrentSendingStream(), config: iceConfig });

    peer.on('signal', signal => {
      socket.emit('returning-signal', { signal, callerId });
    });

    peer.on('stream', remoteStream => {
      setPeers(prev => prev.map(p => p.userId === callerId ? { ...p, stream: remoteStream } : p));
    });

    peer.on('error', err => console.error('Peer error:', err));

    peer.signal(incomingSignal);
    return peer;
  };

  // Persistent ref so StrictMode's double-invoke doesn't emit join-meeting twice
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    let localStream;

    const initMeetingMedia = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (err) {
        console.warn('Video+audio failed, trying audio only:', err);
        try {
          localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (audioErr) {
          console.warn('Audio failed too, joining as listener:', audioErr);
          localStream = new MediaStream();
        }
      }

      // By default, disable camera and mic tracks to join muted and with video off
      if (localStream) {
        localStream.getAudioTracks().forEach(t => t.enabled = false);
        localStream.getVideoTracks().forEach(t => t.enabled = false);
      }

      setStream(localStream);
      localStreamRef.current = localStream;
      currentStreamRef.current = localStream;
      sentVideoTrackRef.current = localStream.getVideoTracks()[0] || null;

      // StrictMode / HMR guard: only emit join-meeting once per component lifetime
      if (hasJoinedRef.current) return;
      hasJoinedRef.current = true;
      socket.emit('join-meeting', {
        meetingId,
        userId: user?._id || user?.id,
        username: user?.name || 'User'
      });

      // ── Named handlers so we can remove them precisely ──────────────────────

      const onHostScreenShare = ({ isSharing }) => {
        setHostScreenSharing(isSharing);
      };

      // EXISTING users: new user joined → we initiate

      const onUserJoined = ({ userId, username, socketId }) => {
        const targetId = socketId || userId;
        if (targetId === socket.id) return;
        if (peersRef.current[targetId]) return;

        const peer = createPeer(targetId, socket.id);
        peersRef.current[targetId] = { peer, username };
        setPeers(prev => {
          const filtered = prev.filter(p => p.userId !== targetId && p.dbUserId !== userId);
          return [...filtered, { peer, userId: targetId, dbUserId: userId, username, stream: null, isHost: false, isMuted: true, isVideoOff: true }];
        });

        // Instantly notify new peer of our actual media states
        socket.emit('toggle-media', { meetingId, isMuted: isMutedRef.current, isVideoOff: isVideoOffRef.current });
      };

      // NEW user: receive offer from existing user → respond

      const onReceivingSignal = ({ signal, callerId, username, callerDbId }) => {
        if (callerId === socket.id) return;

        const existing = peersRef.current[callerId];
        if (existing) {
          // Only forward if NOT yet in stable state (avoids setLocalDescription in wrong state)
          const sigState = existing.peer?._pc?.signalingState;
          if (!existing.peer.destroyed && sigState && sigState !== 'stable' && sigState !== 'have-local-offer') {
            try { existing.peer.signal(signal); } catch (e) { console.warn('re-signal:', e.message); }
          }
          return;
        }

        const peer = addPeer(signal, callerId);
        peersRef.current[callerId] = { peer, username };
        const hostId = meeting?.host?._id || meeting?.host;
        const peerIsHost = hostId && callerDbId && hostId.toString() === callerDbId.toString();
        setPeers(prev => {
          const filtered = prev.filter(p => p.userId !== callerId && p.dbUserId !== callerDbId);
          return [...filtered, { peer, userId: callerId, dbUserId: callerDbId, username, stream: null, isHost: !!peerIsHost, isMuted: true, isVideoOff: true }];
        });

        // Instantly notify initiating peer of our actual media states
        socket.emit('toggle-media', { meetingId, isMuted: isMutedRef.current, isVideoOff: isVideoOffRef.current });
      };

      // Existing user gets answer back from new user
      const onReturnedSignal = ({ signal, id }) => {
        const peerInfo = peersRef.current[id];
        if (!peerInfo || !peerInfo.peer || peerInfo.peer.destroyed) return;
        // Guard: only accept answer if peer is still waiting for one (have-local-offer)
        const sigState = peerInfo.peer?._pc?.signalingState;
        if (sigState !== 'have-local-offer') return; // already stable or not ready
        try { peerInfo.peer.signal(signal); } catch (e) { console.warn('returned-signal err:', e.message); }
      };

      const onUserLeft = ({ userId, socketId }) => {
        const targetId = socketId || userId;
        const peerInfo = peersRef.current[targetId] ||
          Object.values(peersRef.current).find(p => p.userId === userId);
        if (peerInfo) {
          try { peerInfo.peer.destroy(); } catch (e) {}
          const key = Object.keys(peersRef.current).find(k => peersRef.current[k] === peerInfo);
          if (key) delete peersRef.current[key];
        }
        setPeers(prev => prev.filter(p => p.userId !== targetId && p.userId !== userId));
      };

      const onRequestUnmute = ({ requesterName }) => {
        toast((t) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px' }}>
            <span style={{ fontWeight: 700, color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              🎙️ Host Unmute Request
            </span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              Host <strong>{requesterName}</strong> is asking you to unmute your microphone.
            </span>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                onClick={() => {
                  if (localStreamRef.current && localStreamRef.current.getAudioTracks().length > 0) {
                    localStreamRef.current.getAudioTracks()[0].enabled = true;
                  }
                  setIsMuted(false);
                  toast.success('Microphone unmuted! 🎤', { id: t.id });
                }}
                style={{
                  background: 'var(--accent-gradient)',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px var(--accent-glow)'
                }}
              >
                Unmute 🎤
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Keep Muted
              </button>
            </div>
          </div>
        ), {
          duration: 12000,
          style: {
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            color: '#fff',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }
        });
      };

      const onParticipantMediaToggled = ({ socketId, isMuted, isVideoOff }) => {
        setPeers(prev => prev.map(p => {
          if (p.userId === socketId) {
            return { ...p, isMuted, isVideoOff };
          }
          return p;
        }));
      };

      socket.on('host-screen-share', onHostScreenShare);
      socket.on('user-joined', onUserJoined);
      socket.on('receiving-signal', onReceivingSignal);
      socket.on('received-returned-signal', onReturnedSignal);
      socket.on('user-left', onUserLeft);
      socket.on('request-unmute', onRequestUnmute);
      socket.on('participant-media-toggled', onParticipantMediaToggled);

      // Store handlers in ref so cleanup can remove EXACTLY these handlers
      handlersRef.current = { onHostScreenShare, onUserJoined, onReceivingSignal, onReturnedSignal, onUserLeft, onRequestUnmute, onParticipantMediaToggled };
    };

    initMeetingMedia();

    return () => {
      socket.emit('leave-meeting', { meetingId, userId: user?._id });
      if (localStream) localStream.getTracks().forEach(t => t.stop());
      // Remove ONLY the handlers we registered (not all listeners on the event)
      const h = handlersRef.current;
      if (h) {
        socket.off('host-screen-share', h.onHostScreenShare);
        socket.off('user-joined', h.onUserJoined);
        socket.off('receiving-signal', h.onReceivingSignal);
        socket.off('received-returned-signal', h.onReturnedSignal);
        socket.off('user-left', h.onUserLeft);
        socket.off('request-unmute', h.onRequestUnmute);
        socket.off('participant-media-toggled', h.onParticipantMediaToggled);
      }
      Object.values(peersRef.current).forEach(({ peer }) => { try { peer.destroy(); } catch (e) {} });
      peersRef.current = {};
    };
  }, [meetingId, user]);


  const handleToggleScreenShare = async () => {
    if (!isHost) {
      toast.error('Only the meeting host can share their screen');
      return;
    }

    if (isScreenSharing) {
      // ── STOP sharing ──────────────────────────────────────────
      isScreenSharingRef.current = false;
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }

      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const newCameraTrack = cameraStream.getVideoTracks()[0];
        const oldTrack = sentVideoTrackRef.current; // currently sending screen track
        const peerStream = localStreamRef.current;  // stream peers were created with

        // Replace track on every peer — NO removeTrack/addTrack on the stream!
        Object.values(peersRef.current).forEach(({ peer }) => {
          if (peer && !peer.destroyed && oldTrack) {
            try {
              peer.replaceTrack(oldTrack, newCameraTrack, peerStream);
            } catch (e) {
              console.warn('replaceTrack stop-share:', e.message);
            }
          }
        });

        sentVideoTrackRef.current = newCameraTrack;
        setStream(cameraStream); // local display shows camera
        setIsScreenSharing(false);

        // Restore previous camera video off state
        const prevVideoOff = isVideoOffRef.current;
        newCameraTrack.enabled = !prevVideoOff;
        setIsVideoOff(prevVideoOff);

        socket.emit('host-screen-share', { meetingId, isSharing: false });
        socket.emit('toggle-media', { meetingId, isMuted, isVideoOff: prevVideoOff });
        toast.success('📷 Camera active!');
      } catch (err) {
        console.error('Failed to restore camera stream:', err);
      }
    } else {
      // ── START sharing ──────────────────────────────────────────
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        const oldTrack = sentVideoTrackRef.current; // currently sending camera track
        const peerStream = localStreamRef.current;  // stream peers were created with
        screenStreamRef.current = screenStream;
        isScreenSharingRef.current = true;

        // Replace track on every peer — NO removeTrack/addTrack on the stream!
        Object.values(peersRef.current).forEach(({ peer }) => {
          if (peer && !peer.destroyed && oldTrack) {
            try {
              peer.replaceTrack(oldTrack, screenTrack, peerStream);
            } catch (e) {
              console.warn('replaceTrack start-share:', e.message);
            }
          }
        });

        sentVideoTrackRef.current = screenTrack;
        setStream(screenStream); // local display shows screen
        setIsScreenSharing(true);
        setIsVideoOff(false); // Mark video off as false (active!) since screen sharing IS video
        socket.emit('host-screen-share', { meetingId, isSharing: true });
        socket.emit('toggle-media', { meetingId, isMuted, isVideoOff: false }); // Broadcast active video!
        toast.success('🖥️ Screen sharing active!');

        // Handle browser-native Stop Sharing button
        screenTrack.onended = async () => {
          if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(t => t.stop());
            screenStreamRef.current = null;
          }

          try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const restoredTrack = cameraStream.getVideoTracks()[0];
            const staleTrack = sentVideoTrackRef.current; // screen track (ended)
            const ps = localStreamRef.current;

            Object.values(peersRef.current).forEach(({ peer }) => {
              if (peer && !peer.destroyed && staleTrack) {
                try {
                  peer.replaceTrack(staleTrack, restoredTrack, ps);
                } catch (e) {
                  console.warn('replaceTrack onended:', e.message);
                }
              }
            });

            sentVideoTrackRef.current = restoredTrack;
            setStream(cameraStream);
            setIsScreenSharing(false);
            isScreenSharingRef.current = false;

            // Restore previous camera video off state
            const prevVideoOff = isVideoOffRef.current;
            restoredTrack.enabled = !prevVideoOff;
            setIsVideoOff(prevVideoOff);

            socket.emit('host-screen-share', { meetingId, isSharing: false });
            socket.emit('toggle-media', { meetingId, isMuted, isVideoOff: prevVideoOff });
            toast.success('📷 Camera active!');
          } catch (err) {
            console.error('Failed to restore camera on screen share end:', err);
          }
        };
      } catch (e) {
        toast.error('Screen sharing cancelled');
      }
    }
  };

  // Recording Toggles
  const handleToggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      toast.success('⏹️ Recording stopped!');
    } else {
      recordedChunksRef.current = [];
      try {
        toast.loading('🖥️ Please select the screen/tab you want to record...', { id: 'rec-init', duration: 3000 });
        
        // 1. Capture screen video and tab audio
        let screenStream;
        try {
          screenStream = await navigator.mediaDevices.getDisplayMedia({ 
            video: { cursor: "always" }, 
            audio: true 
          });
        } catch (displayErr) {
          console.warn("Complex displayMedia failed, falling back to simple video:", displayErr);
          try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          } catch (mobileErr) {
            console.error("Simple displayMedia failed too:", mobileErr);
            throw mobileErr;
          }
        }
        
        // 2. Fetch mic stream to record voiceover
        let micTracks = [];
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micTracks = micStream.getAudioTracks();
        } catch (err) {
          console.warn("No mic access for recording voiceover", err);
        }

        // 3. Combine tracks: Screen Video + Screen/Tab Audio + Mic Audio
        const combinedTracks = [
          ...screenStream.getVideoTracks(),
          ...screenStream.getAudioTracks(),
          ...micTracks
        ];

        const recordStream = new MediaStream(combinedTracks);

        // Auto-stop recording if user stops sharing the screen via the browser native toolbar
        screenStream.getVideoTracks()[0].onended = () => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
          }
          setIsRecording(false);
        };

        const recorder = new MediaRecorder(recordStream, { mimeType: 'video/webm;codecs=vp9,opus' });
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          uploadRecording(blob);
          // Stop all screen and mic tracks to clean up devices
          combinedTracks.forEach(track => track.stop());
        };
        mediaRecorderRef.current = recorder;
        recorder.start(1000);
        setIsRecording(true);
        toast.success('🎙️ Meeting screen recording started!', { id: 'rec-init' });
      } catch (e) {
        console.error("Recording start failed:", e);
        // Fallback using current local stream (camera only) if display media is cancelled
        if (!stream) {
          toast.error('Could not capture screen or camera stream', { id: 'rec-init' });
          return;
        }
        
        try {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
            }
          };
          recorder.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            uploadRecording(blob);
          };
          mediaRecorderRef.current = recorder;
          recorder.start(1000);
          setIsRecording(true);
          toast.success('🎙️ Recording started (Camera fallback)', { id: 'rec-init' });
        } catch (fallbackError) {
          toast.error('Failed to start recording', { id: 'rec-init' });
        }
      }
    }
  };

  const uploadRecording = async (blob) => {
    try {
      toast.loading('☁️ Uploading recording to Cloudinary...', { id: 'upload' });

      const formData = new FormData();
      formData.append('meetingId', meetingId);
      formData.append('recording', blob, `meeting_${meetingId}_${Date.now()}.webm`);

      await axios.post('/api/recordings/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('☁️ Recording successfully saved to Cloudinary!', { id: 'upload' });
    } catch (e) {
      toast.error('Failed to upload recording to Cloudinary', { id: 'upload' });
      console.error('Failed to upload recording:', e);
    } finally {
      if (recordedChunksRef.current.uploadOnStop) {
        await saveHistoryAndLeave();
      }
    }
  };

  const saveHistoryAndLeave = async () => {
    try {
      const duration = Math.round((Date.now() - startTime) / 60000) || 1;
      const participantNames = [user?.name, ...peers.map(p => p.username)];
      await axios.post('/api/history/save', {
        meetingId,
        title: meeting?.title || 'Completed IntellMeet Session',
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration,
        participants: participantNames
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error('Failed to log meeting to database history:', e);
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }

    socket.emit('leave-meeting', { meetingId, userId: user?._id });
    toast.success('🚪 Meeting ended successfully!', { id: 'end-meeting' });
    navigate('/dashboard');
  };

  const endCall = async () => {
    if (isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      toast.loading('Processing and saving recording... Please wait.', { id: 'end-meeting' });
      recordedChunksRef.current.uploadOnStop = true;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }
    await saveHistoryAndLeave();
  };

  // Send unmute request to target participant socket
  const handleRequestUnmute = (targetParticipant) => {
    if (!isHost) return;
    if (targetParticipant.userId === socket.id) {
      toast.error('You cannot request yourself to unmute!');
      return;
    }
    socket.emit('request-unmute', {
      targetSocketId: targetParticipant.userId, // peer's socket ID
      requesterName: user?.name || 'Host'
    });
    toast.success(`Sent microphone unmute request to ${targetParticipant.username}! 🎙️`);
  };

  // Improved participant list logic: always show all unique users
  const uniqueParticipants = [];
  const seenKeys = new Set();
  const localUserId = user?._id || user?.id || '';
  const localUsername = user?.name || 'You';

  // Add local user
  const localKey = `${localUserId}::${localUsername}`;
  uniqueParticipants.push({
    userId: localUserId,
    username: localUsername,
    online: true,
    isHost: isHost,
    isMuted: isMuted,
    isVideoOff: isVideoOff
  });
  seenKeys.add(localKey);

  // Add all peers, using composite key for uniqueness
  peers.forEach(p => {
    const peerId = p.dbUserId || p.userId || '';
    const peerName = p.username || '';
    const key = `${peerId}::${peerName}`;
    if (!seenKeys.has(key)) {
      uniqueParticipants.push({
        userId: p.userId,
        username: p.username,
        online: true,
        isHost: getIsUserHost(p.dbUserId, p.username),
        isMuted: p.isMuted !== undefined ? p.isMuted : true,
        isVideoOff: p.isVideoOff !== undefined ? p.isVideoOff : true
      });
      seenKeys.add(key);
    }
  });

  return (
    <div className="room" style={{ padding: '24px', minHeight: '100vh', background: 'var(--bg-darker)' }}>
      
      {/* Top Info Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-card)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius)',
        padding: '16px 28px',
        marginBottom: '24px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '18px', margin: 0, fontFamily: 'Space Grotesk', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--accent-2)', animation: 'pulse-glow 1.5s infinite' }}>🟢</span> 
            Meeting Room Active: {meeting?.title || 'Loading...'}
          </h2>
          <span style={{ color: 'var(--muted)', fontSize: '12px', marginTop: 4, display: 'inline-block' }}>
            Session Key: <strong style={{ color: 'var(--accent)', fontFamily: 'Space Grotesk' }}>{meetingId}</strong>
          </span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(meetingId);
            toast.success('Meeting ID copied to clipboard!');
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            fontFamily: 'Space Grotesk, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.35)';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          📋 Copy Meeting ID
        </button>
      </div>

      <div className="room__grid">
        <div className="room__videos">
          <VideoPlayer 
            stream={stream} 
            muted 
            username={user?.name} 
            isScreenShare={isScreenSharing} 
            isLocal 
            isMuted={isMuted} 
            isVideoOff={isVideoOff} 
          />
          {peers.map((peer) => (
            <VideoPlayer
              key={peer.userId}
              stream={peer.stream}
              username={peer.username}
              // If the host is sharing, mark the host's tile as a screen share
              // so the CSS does not mirror it and the expand button appears
              isScreenShare={hostScreenSharing && getIsUserHost(peer.dbUserId, peer.username)}
              isMuted={peer.isMuted !== undefined ? peer.isMuted : true}
              isVideoOff={peer.isVideoOff !== undefined ? peer.isVideoOff : true}
            />
          ))}
        </div>
        <div>
          <ParticipantList participants={uniqueParticipants} isHost={isHost} onRequestUnmute={handleRequestUnmute} />
            <div style={{ marginTop: 20 }}>
              <CollaborationDashboard meetingId={meetingId} participants={uniqueParticipants} />
            </div>
            <div style={{ marginTop: 20 }}>
              <MeetingAI meetingId={meetingId} />
            </div>
        </div>
      </div>

      <MeetingControls
        isMuted={isMuted}
        setIsMuted={(muted) => {
          const micStream = localStreamRef.current || stream;
          if (micStream && micStream.getAudioTracks().length > 0) {
            micStream.getAudioTracks()[0].enabled = !muted;
          }
          setIsMuted(muted);
          socket.emit('toggle-media', { meetingId, isMuted: muted, isVideoOff });
        }}
        isVideoOff={isVideoOff}
        setIsVideoOff={(off) => {
          // Prevent disabling video while a screen share is active – it would break the shared stream
          if (isScreenSharing) {
            toast('Video cannot be turned off while screen sharing is active');
            return;
          }
          const camStream = localStreamRef.current || stream;
          if (camStream && camStream.getVideoTracks().length > 0) {
            camStream.getVideoTracks()[0].enabled = !off;
          }
          setIsVideoOff(off);
          socket.emit('toggle-media', { meetingId, isMuted, isVideoOff: off });
        }}
        isHost={isHost}
        isRecording={isRecording}
        onToggleRecording={handleToggleRecording}
        isScreenSharing={isScreenSharing}
        onToggleScreenShare={handleToggleScreenShare}
        onEndCall={endCall}
      />
    </div>
  );
}