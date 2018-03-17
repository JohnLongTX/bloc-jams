import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props){
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      isPlaying: false ,
      songVolume: 1,

    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
      volumechange: e => {
        this.setState({ songVolume: this.audioElement.volume });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
   }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    console.log(isSameSong);
    console.log(this.state.isPlaying);
    if (this.state.isPlaying && isSameSong) {
      console.log('pause');
      this.pause();
    }else {
      console.log('play');
      if (!isSameSong) { this.setSong(song); } 
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex( song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex( song => this.state.currentSong === song);
    const numberSongs = this.state.album.songs.length;
    const newIndex = Math.min(currentIndex + 1, numberSongs - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ songVolume: newVolume });
    console.log(this.state.songVolume);
  }

  convertTime(seconds){
    if (seconds) {
      const converted = Math.floor(seconds/60) + ":" + (((seconds%60)< 10) ? ("0" + (Math.floor(seconds%60))) : (Math.floor(seconds%60)));
      return converted;
    }else{
      return"-:--";
    }
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Duration</th>
            </tr>
            {
              this.state.album.songs.map( (song, index) =>
                <tr className="song" key={index} onClick={ () => this.handleSongClick(song) }>
                  <td className="song-number">{index + 1}</td>
                  <td className="song-title">{song.title}</td>
                  <td className="song-duration">{this.convertTime(song.duration)}</td>
                  <td>
                    <button>
                      <span className="ion-play"></span>
                      <span className="ion-pause"></span>
                    </button>
                  </td>
                </tr>
            )
            }
          </tbody>
        </table>
        <PlayerBar 
          isPlaying={this.state.isPlaying} 
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.convertTime(this.audioElement.duration)}
          songVolume={this.audioElement.volume} 
          handleSongClick={ () => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={ () => this.handlePrevClick()}
          handleNextClick={ () => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          convertTime={this.convertTime(this.state.currentTime)}
          />
      </section>
    )
  }
}

export default Album;