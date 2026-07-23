package com.nik.streamx.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val CinemaColorScheme = darkColorScheme(
    primary = GlowRedAccent,
    secondary = NeonCyanAccent,
    background = DeepGraphite,
    surface = SoftGlassDark,
    surfaceVariant = SurfaceVariantDark,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    onSurfaceVariant = TextSecondary
)

@Composable
fun NIKSTREAMXTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = CinemaColorScheme,
        content = content
    )
}
