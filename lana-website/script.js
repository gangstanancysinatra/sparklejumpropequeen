// Song database - add your own Lana songs here
const songs = [
    { 
        title: "Born to Die (Radio Edit)", 
        duration: "4:09", 
        file: "songs/born-to-die.mp3",
        artist: "Lana Del Rey"
    },
    { 
        title: "Blue Jeans (Radio Edit)", 
        duration: "3:30", 
        file: "songs/blue-jeans.mp3",
        artist: "Lana Del Rey"
    },
    { 
        title: "Video Games (Radio Edit)", 
        duration: "4:02", 
        file: "songs/video-games.mp3",
        artist: "Lana Del Rey"
    },
    { 
        title: "Summertime Sadness (Radio Mix)", 
        duration: "4:12", 
        file: "songs/summertime.mp3",
        artist: "Lana Del Rey"
    },
    { 
        title: "National Anthem (Radio Edit)", 
        duration: "3:51", 
        file: "songs/national-anthem.mp3",
        artist: "Lana Del Rey"
    },
    // Add all 11 songs here
];

// DOM elements
const playlistEl = document.getElementById('playlist');
const downloadAllBtn = document.getElementById('download-all');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');

// Audio player
let audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;

// Initialize the playlist
function initPlaylist() {
    playlistEl.innerHTML = '';
    
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="song-info">
                <span class="song-number">${String(index + 1).padStart(2, '0')}</span>
                <span class="song-title">${song.title}</span>
            </div>
            <div class="song-controls">
                <span class="song-duration">${song.duration}</span>
                <button class="play-btn" data-index="${index}">▶</button>
            </div>
        `;
        playlistEl.appendChild(li);
    });
    
    // Add event listeners to play buttons
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            playSong(index);
        });
    });
}

// Play song function
function playSong(index) {
    const song = songs[index];
    
    // Update UI
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.classList.remove('playing');
        btn.textContent = '▶';
    });
    
    const currentBtn = document.querySelector(`.play-btn[data-index="${index}"]`);
    currentBtn.classList.add('playing');
    currentBtn.textContent = '⏸';
    
    // Play audio
    audio.src = song.file;
    audio.play();
    isPlaying = true;
    currentSongIndex = index;
    
    // Update time display
    updateTimeDisplay();
}

// Update time display
audio.addEventListener('timeupdate', updateTimeDisplay);
audio.addEventListener('loadedmetadata', updateTimeDisplay);

function updateTimeDisplay() {
    if (audio.duration) {
        const current = formatTime(audio.currentTime);
        const total = formatTime(audio.duration);
        currentTimeEl.textContent = current;
        totalTimeEl.textContent = total;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// When song ends, play next
audio.addEventListener('ended', () => {
    if (currentSongIndex < songs.length - 1) {
        playSong(currentSongIndex + 1);
    } else {
        // Reset play button
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.classList.remove('playing');
            btn.textContent = '▶';
        });
        isPlaying = false;
    }
});

// ⭐ KEY FEATURE: Download all as ZIP using JSZip + FileSaver ⭐ [citation:2][citation:8]
downloadAllBtn.addEventListener('click', async () => {
    try {
        downloadAllBtn.textContent = '⏳ Creating ZIP...';
        downloadAllBtn.disabled = true;
        
        // Create new ZIP archive
        const zip = new JSZip();
        
        // Add each song to the ZIP
        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            downloadAllBtn.textContent = `⏳ Adding ${song.title}...`;
            
            try {
                // Fetch the audio file
                const response = await fetch(song.file);
                const blob = await response.blob();
                
                // Add to ZIP with proper filename
                const filename = `${String(i + 1).padStart(2, '0')} - ${song.title}.mp3`;
                zip.file(filename, blob);
                
            } catch (error) {
                console.error(`Error adding ${song.title}:`, error);
            }
        }
        
        downloadAllBtn.textContent = '⏳ Generating ZIP...';
        
        // Generate the ZIP file [citation:2]
        const content = await zip.generateAsync({ 
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
        
        // Save using FileSaver.js [citation:1][citation:10]
        saveAs(content, 'Lana_Del_Rey_Radio_Edits.zip');
        
        downloadAllBtn.textContent = '✅ Downloaded!';
        setTimeout(() => {
            downloadAllBtn.textContent = '⬇️ Download All as ZIP';
            downloadAllBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error creating ZIP:', error);
        downloadAllBtn.textContent = '❌ Error - Try Again';
        setTimeout(() => {
            downloadAllBtn.textContent = '⬇️ Download All as ZIP';
            downloadAllBtn.disabled = false;
        }, 2000);
    }
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    initPlaylist();
});