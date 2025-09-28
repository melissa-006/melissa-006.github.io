Add-Type -AssemblyName System.Drawing

function Rotate-Image {
    param([System.Drawing.Image]$Image, [int]$Orientation)
    if ($Orientation -eq 1) { return $Image }  # Normal
    $rotated = New-Object System.Drawing.Bitmap($Image.Height, $Image.Width)
    $g = [System.Drawing.Graphics]::FromImage($rotated)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    switch ($Orientation) {
        3 { $g.TranslateTransform($Image.Width / 2, $Image.Height / 2); $g.RotateTransform(180); $g.TranslateTransform(-$Image.Width / 2, -$Image.Height / 2) }
        6 { $g.TranslateTransform($Image.Height, 0); $g.RotateTransform(90); $g.TranslateTransform(0, -$Image.Height) }
        8 { $g.TranslateTransform($Image.Width, 0); $g.RotateTransform(270); $g.TranslateTransform(0, -$Image.Width) }
    }
    $g.DrawImage($Image, 0, 0)
    $g.Dispose()
    return $rotated
}

$images = @(
    "DSC00289.JPG", "DSC00295.JPG", "DSC00798.JPG", "DSC00325.JPG", "DSC00376.JPG", "DSC00384.JPG", "DSC00399.JPG", "DSC00425.JPG", "DSC00456.JPG", "DSC00473.JPG",
    "DSC00546.JPG", "DSC00548.JPG", "DSC00549.JPG", "DSC00554.JPG", "DSC00629.JPG", "DSC00637.JPG", "DSC00644.JPG", "DSC00648.JPG", "DSC00653.JPG", "DSC00672.JPG",
    "DSC00693.JPG", "DSC00708.JPG", "DSC00772.JPG", "DSC00775.JPG", "DSC00789.JPG", "DSC00791.JPG", "DSC00806.JPG", "DSC00808.JPG", "DSC00809.JPG", "DSC00837.JPG",
    "DSC00865.JPG", "DSC00874.JPG", "DSC00896.JPG", "DSC00963.JPG", "DSC01010.JPG", "DSC01027.JPG", "DSC01034.JPG", "DSC01205.JPG", "DSC01212.JPG", "DSC01405.JPG",
    "DSC01483.JPG", "20250322_171629.jpg", "IMG-20241208-WA0009.jpg", "IMG-20250607-WA0005.jpg", "IMG-20250607-WA0006.jpg", "IMG-20250621-WA0001.jpg", "IMG-20250523-WA0004.jpg",
    "IMG-20250524-WA0075.jpg", "IMG-20250524-WA0078.jpg", "IMG-20250524-WA0086.jpg", "IMG-20250525-WA0084.jpg", "IMG-20250525-WA0133.jpg", "IMG-20250526-WA0050.jpg",
    "IMG-20250526-WA0066.jpg", "IMG-20250526-WA0076.jpg", "IMG-20250526-WA0077.jpg", "IMG-20250526-WA0078.jpg", "IMG-20250526-WA0124.jpg", "IMG-20250527-WA0001.jpg",
    "IMG-20250527-WA0002.jpg", "IMG-20250527-WA0020.jpg", "IMG-20250527-WA0026.jpg", "IMG-20250527-WA0047.jpg", "IMG-20250527-WA0065.jpg", "IMG-20250527-WA0071.jpg",
    "IMG-20250528-WA0043.jpg", "IMG-20250528-WA0052.jpg", "IMG-20250528-WA0106.jpg", "IMG-20250530-WA0020.jpg", "IMG-20250530-WA0030.jpg", "IMG-20250530-WA0041.jpg"
)

$sizes = @(400, 800, 1200)
$suffixes = @("small", "medium", "large")

foreach ($img in $images) {
    $base = [System.IO.Path]::GetFileNameWithoutExtension($img)
    $ext = [System.IO.Path]::GetExtension($img)
    $path = "images\$img"
    if (Test-Path $path) {
        $original = [System.Drawing.Image]::FromFile($path)
        
        # Read EXIF orientation
        $orientation = 1
        try {
            $propItem = $original.GetPropertyItem(0x0112)
            if ($propItem) {
                $orientation = [System.BitConverter]::ToUInt16($propItem.Value, 0)
            }
        } catch {
            # No EXIF or error, use default
        }
        
        # Rotate if needed
        $oriented = Rotate-Image -Image $original -Orientation $orientation
        
        for ($i = 0; $i -lt $sizes.Length; $i++) {
            $size = $sizes[$i]
            $suffix = $suffixes[$i]
            $newPath = "images\$base-$suffix$ext"
            if ($oriented.Width -gt $size) {
                $ratio = $size / $oriented.Width
                $newHeight = [int]($oriented.Height * $ratio)
                $resized = New-Object System.Drawing.Bitmap $size, $newHeight
                $graphics = [System.Drawing.Graphics]::FromImage($resized)
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.DrawImage($oriented, 0, 0, $size, $newHeight)
                $resized.Save($newPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
                $graphics.Dispose()
                $resized.Dispose()
            } else {
                # For small images, copy the oriented version
                $oriented.Save($newPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
            }
        }
        
        $oriented.Dispose()
        $original.Dispose()
    }
}

Write-Host "Resizing complete with EXIF orientation correction."
