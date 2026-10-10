// 1. Define your track list array
const trackList = [
    {
        title: "Summer Breeze",
        artist: "Lofi Dreamer",
        art: "https://picsum.photos",
        path: "https://soundhelix.com"
    },
    {
        title: "Neon Horizon",
        artist: "Synthwave Kid",
        art: "https://picsum.photos",
        path: "https://soundhelix.com"
    },
    {
        title: "Midnight Drive",
        artist: "Retro Beats",
        art: "https://picsum.photos",
        path: "https://soundhelix.com"
    },
    {
        title: "Deep Ocean",
        artist: "Ambient Wave",
        art: "https://picsum.photos",
        path: "https://soundhelix.com"
    }
];

// 2. Player State Variables
let currentTrackIndex = 0;
let isPlaying = false;
let isAutoplayEnabled = true; // Enabled by default as requested
let updateTimerInterval;

// 3. Create HTML5 Audio instance
const audioPlayer = new Audio();

// 4. DOM Elements Lookup
const trackArt = document.getElementById("track-art");
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");

const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const autoplayBtn = document.getElementById("autoplay-btn");
const togglePlaylistBtn = document.getElementById("toggle-playlist-btn");

const progressSlider = document.getElementById("progress-slider");
const volumeSlider = document.getElementById("volume-slider");
const currentTimeDisplay = document.getElementById("current-time");
const totalDurationDisplay = document.getElementById("total-duration");
const playlistContainer = document.getElementById("playlist-items");
const playlistCard = document.getElementById("playlist-card");

// 5. Initialize App
window.addEventListener("DOMContentLoaded", () => {
    buildPlaylistUI();
    loadTrack(currentTrackIndex);
    
    // Sync initial baseline volumes
    audioPlayer.volume = volumeSlider.value;
    
    if(isAutoplayEnabled) {
        autoplayBtn.classList.add("active");
    }
});

// 6. Build Playlist Items dynamically
function buildPlaylistUI() {
    playlistContainer.innerHTML = "";
    trackList.forEach((track, index) => {
        const li = document.createElement("li");
        li.setAttribute("data-index", index);
        if(index === currentTrackIndex) li.classList.add("active-song");
        
        li.innerHTML = `
            <div class="song-info">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
            </div>
            <span class="song-duration">3:12</span>
        `;
        
        li.addEventListener("click", () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            playTrack();
        });
        playlistContainer.appendChild(li);
    });
}

function updatePlaylistSelectionUI() {
    const items = playlistContainer.querySelectorAll("li");
    items.forEach((item, index) => {
        if(index === currentTrackIndex) {
            item.classList.add("active-song");
        } else {
            item.classList.remove("active-song");
        }
    });
}

// 7. Track Loading Mechanisms
function loadTrack(index) {
    clearInterval(updateTimerInterval);
    resetSliderValues();

    // Map UI values from object track array configuration
    audioPlayer.src = trackList[index].path;
    audioPlayer.load();

    trackTitle.innerText = trackList[index].title;
    trackArtist.innerText = trackList[index].artist;
    trackArt.style.backgroundImage = `url('${trackList[index].art}')`;

    updatePlaylistSelectionUI();

    // Track metadata loading duration tracking hook
    audioPlayer.addEventListener("loadedmetadata", () => {
        totalDurationDisplay.innerText = formatTimeDisplay(audioPlayer.duration);
    });

    // Start interval loop to update tracker positions
    updateTimerInterval = setInterval(updateSliderProgress, 500);
}

function resetSliderValues() {
    currentTimeDisplay.innerText = "0:00";
    totalDurationDisplay.innerText = "0:00";
    progressSlider.value = 0;
}

// 8. Control Actions: Play / Pause / Next / Prev
function togglePlayPause() {
    if (!isPlaying) {
        playTrack();
    } else {
        pauseTrack();
    }
}

function playTrack() {
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.innerHTML = "<i class='bx bx-pause'></i>";
    trackArt.style.animationPlayState = "running";
}

function pauseTrack() {
    audioPlayer.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = "<i class='bx bx-play'></i>";
    trackArt.style.animationPlayState = "paused";
}

function nextTrack() {
    if (currentTrackIndex < trackList.length - 1) {
        currentTrackIndex += 1;
    } else {
        currentTrackIndex = 0; // Loop around to the start
    }
    loadTrack(currentTrackIndex);
    playTrack();
}

function prevTrack() {
    if (currentTrackIndex > 0) {
        currentTrackIndex -= 1;
    } else {
        currentTrackIndex = trackList.length - 1; // Loop back to the end
    }
    loadTrack(currentTrackIndex);
    playTrack();
}

// 9. Duration Formatter Utility
function formatTimeDisplay(seconds) {
    if (isNaN(seconds)) return "0:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (secs < 10) secs = `0${secs}`;
    return `${mins}:${secs}`;
}

// 10. Update Sliders & Sync Current Play Time
function updateSliderProgress() {
    if (!isNaN(audioPlayer.duration)) {
        const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressSlider.value = progressPercentage;
        currentTimeDisplay.innerText = formatTimeDisplay(audioPlayer.currentTime);
    }
}

// Seek Track manipulation handler
progressSlider.addEventListener("input", () => {
    const seekToTime = audioPlayer.duration * (progressSlider.value / 100);
    audioPlayer.currentTime = seekToTime;
});

// Volume update slider handlers
volumeSlider.addEventListener("input", () => {
    audioPlayer.volume = volumeSlider.value;
});

// 11. Autoplay Mechanism
audioPlayer.addEventListener("ended", () => {
    if (isAutoplayEnabled) {
        nextTrack(); // Advance automatically
    } else {
        pauseTrack(); // Halt playback on track finalization
    }
});

// Autoplay Activation Flag Toggles
autoplayBtn.addEventListener("click", () => {
    isAutoplayEnabled = !isAutoplayEnabled;
    autoplayBtn.classList.toggle("active", isAutoplayEnabled);
});

// Layout Toggles (Playlist Visibility)
togglePlaylistBtn.addEventListener("click", () => {
    playlistCard.classList.toggle("hidden");
});

// Register Core Control Action Events
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
