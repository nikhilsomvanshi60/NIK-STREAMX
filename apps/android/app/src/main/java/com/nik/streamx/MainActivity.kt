package com.nik.streamx

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.nik.streamx.ui.player.PlayerScreen
import com.nik.streamx.ui.theme.DeepGraphite
import com.nik.streamx.ui.theme.NIKSTREAMXTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NIKSTREAMXTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = DeepGraphite
                ) {
                    PlayerScreen(
                        streamUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
                        title = "Big Buck Bunny — Legal HLS Vertical Slice"
                    )
                }
            }
        }
    }
}
