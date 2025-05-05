import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
    playlistUrl: string | null;
  }

const VideoPlayer: React.FC<VideoPlayerProps> = ({ playlistUrl }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsInstance = useRef<Hls | null>(null);

    useEffect(() => {
        if (!playlistUrl || !videoRef.current) return;

        const video = videoRef.current;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(playlistUrl); // Charger la playlist HLS
            hls.attachMedia(video); // Attacher la vidéo à HLS.js
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              video.play().catch((error) => {
                console.error("Erreur lors de la lecture de la vidéo :", error);
              });
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // Fallback pour les navigateurs qui supportent HLS nativement (Safari)
            video.src = playlistUrl;
            video.addEventListener("loadedmetadata", () => {
              video.play().catch((error) => {
                console.error("Erreur lors de la lecture de la vidéo :", error);
              });
            });
        }

        // Nettoyage : détruire l'instance HLS si elle existe
        return () => {
            if (hlsInstance.current) {
            hlsInstance.current.destroy(); // Détruisez l'instance HLS
            hlsInstance.current = null; // Réinitialisez la référence
            }
        };
      
    }, [playlistUrl]);

    return <video ref={videoRef} controls width="1280" height="720" className="rounded-md"></video>;
};

export default VideoPlayer;