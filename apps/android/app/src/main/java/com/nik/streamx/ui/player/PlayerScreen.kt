package com.nik.streamx.ui.player

import android.content.Context
import android.net.Uri
import androidx.annotation.OptIn
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import com.nik.streamx.ui.theme.*

@OptIn(UnstableApi::)
@Composable
fun PlayerScreen(
    streamUrl: String = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    title: String = "Authorized HLS Stream"
) {
    val context = LocalContext.current
    var showDiagnostics by remember { mutableStateOf(true) }
    var currentBitrate by remember { mutableStateOf("2.8 Mbps") }
    var currentResolution by remember { mutableStateOf("1920x1080") }
    var currentFps by remember { mutableStateOf("60 FPS") }
    var currentCodec by remember { mutableStateOf("h264 / mp4a") }
    var currentProtocol by remember { mutableStateOf("HLS (m3u8)") }
    var bufferDuration by remember { mutableStateOf("4.2s") }

    val exoPlayer = remember {
        ExoPlayer.Builder(context).build().apply {
            val mediaItem = MediaItem.fromUri(Uri.parse(streamUrl))
            setMediaItem(mediaItem)
            prepare()
            playWhenReady = true

            addListener(object : Player.Listener {
                override fun onPlaybackStateChanged(playbackState: Int) {
                    // Update diagnostics based on player state
                }
            })
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            exoPlayer.release()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepGraphite)
    ) {
        // Media3 PlayerView container
        AndroidView(
            factory = { ctx ->
                PlayerView(ctx).apply {
                    player = exoPlayer
                    useController = true
                }
            },
            modifier = Modifier.fillMaxSize()
        )

        // Top Control Bar & Diagnostics Toggle
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp)
                .align(Alignment.TopStart),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "NIK STREAMX — $title",
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Button(
                onClick = { showDiagnostics = !showDiagnostics },
                colors = ButtonDefaults.buttonColors(containerColor = SoftGlassDark),
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .border(1.dp, GlassBorder, RoundedCornerShape(8.dp))
                    .focusable()
            ) {
                Text(
                    text = if (showDiagnostics) "Hide Stats" else "Stats HUD",
                    color = NeonCyanAccent,
                    fontSize = 13.sp
                )
            }
        }

        // Cinema Control Deck Diagnostics Overlay
        AnimatedVisibility(
            visible = showDiagnostics,
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(24.dp)
        ) {
            Column(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(SoftGlassDark)
                    .border(1.dp, GlassBorder, RoundedCornerShape(12.dp))
                    .padding(16.dp)
            ) {
                Text(
                    text = "CINEMA CONTROL DECK — DIAGNOSTICS",
                    color = GlowRedAccent,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 8.dp)
                )

                DiagnosticRow(label = "Protocol", value = currentProtocol)
                DiagnosticRow(label = "Resolution", value = currentResolution)
                DiagnosticRow(label = "Bitrate", value = currentBitrate)
                DiagnosticRow(label = "FPS", value = currentFps)
                DiagnosticRow(label = "Codec", value = currentCodec)
                DiagnosticRow(label = "Buffer Duration", value = bufferDuration)
            }
        }
    }
}

@Composable
fun DiagnosticRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .width(260.dp)
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, color = TextSecondary, fontSize = 12.sp)
        Text(text = value, color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
    }
}
