import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { HttpHeaders } from '@angular/common/http';
import { Message } from '../message';
import { Player } from '../player';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GameLocation } from '../game-location';
import { Router } from '@angular/router';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  player: Player = null;
  players: Array<Player> = [];
  sendPlayers: Array<Player> = [];
  sentMessages: Array<Message> = [];
  receivedMessages: Array<Message> = [];
  playerClasses: Array<String> = ['Knight', 'Wizard', 'Thief', 'Paladin'];
  locations: Array<GameLocation> = [];

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    playerClass: new FormControl('', [
      Validators.required,
    ]),
  });

  sendForm = new FormGroup({
    sendPlayer: new FormControl('', [
      Validators.required,
    ]),
    text: new FormControl('', [
      Validators.required,
    ])
  });


  isWarningVisible: boolean;
  warningText: string;



  constructor(private api: ApiService, private auth: AuthService, private router: Router) { }

  getAuthOptions() {
    return { headers: new HttpHeaders().set('Authorization', 'Token ' + this.auth.accessToken) };
  }

  ngOnInit() {
    this.hideWarning();
    this.loadPlayers();
    this.loadLocations();
  }

  loadLocations() {
    this.api.get('/locations/', this.getAuthOptions()).subscribe((locations: Array<GameLocation>) => {
      this.locations = locations;
    }, (e) => {
      console.log(e);
    });
  }

  changeLocation(location: GameLocation) {
    if (this.player) {
      this.api.patch('/players/' + this.player.id + '/', {
        position: this.api.ServerAddress + '/locations/' + location.id + '/'
      }, this.getAuthOptions()).subscribe((d) => {
        this.loadPlayers();
        console.log(d);
      }, (e) => {
        console.log(e);
      });
    }
  }

  loadPlayers() {
    const newPlayers: Array<Player> = [];
    const newSendPlayers: Array<Player> = [];
    this.api.get('/players/', this.getAuthOptions()).subscribe((players: Array<Player>) => {
      players.forEach(player => {
        if (player.email === this.auth.email) {
          newPlayers.push(player);
        }
        console.log(player);
        if (this.player && this.player.position === player.position) {
          newSendPlayers.push(player);
        }
        if (this.player && this.player.id === player.id) {
          this.player = player;
        }
      });
      this.players = newPlayers;
      this.sendPlayers = newSendPlayers;
    }, (e) => {
      console.log(e);
    });
  }

  choosePlayer(player) {
    this.player = player;
    this.updateMessages();
    this.loadPlayers();
  }

  updateMessages() {
    this.sentMessages = [];
    this.receivedMessages = [];
    this.api.get('/messages/', this.getAuthOptions()).subscribe((messages: Array<Message>) => {
      const playerEnd = this.player.id + '/';
      messages.forEach(message => {
        if (message.player_from.endsWith(playerEnd)) {
          this.api.get(message.player_to, this.getAuthOptions()).subscribe((player: Player) => {
            message.playerTo = player.name;
            this.sentMessages.push(message);
          });
        }
        if (message.player_to.endsWith(playerEnd)) {
          this.api.get(message.player_from, this.getAuthOptions()).subscribe((player: Player) => {
            message.playerFrom = player.name;
            this.receivedMessages.push(message);
          });
        }
      });
    }, (e) => {
      console.log(e);
    });
  }

  showWarning(text = null) {
    this.warningText = text;
    this.isWarningVisible = true;
  }

  hideWarning() {
    this.isWarningVisible = false;

  }

  createPlayer(credentials) {
    console.log(credentials);
    this.api.post('/players/', {
      name: credentials.name,
      email: this.auth.email,
      position: this.api.ServerAddress + '/locations/1/',
      level: 1,
      player_class: credentials.playerClass,
    }, this.getAuthOptions()).subscribe((data) => {
      console.log(data);
      this.loadPlayers();
    }, e => {
      console.log(e);
      this.showWarning(e.error.name[0]);
    });
  }

  sendMessage(credentials) {
    console.log(credentials);
    this.api.post('/messages/', {
      text: credentials.text,
      player_from: this.api.ServerAddress + '/players/' + this.player.id + '/',
      player_to: this.api.ServerAddress + '/players/' + credentials.sendPlayer + '/',
    }, this.getAuthOptions()).subscribe((data) => {
      console.log(data);
      this.updateMessages();
    }, e => {
      console.log(e);
      this.showWarning(e.error.name[0]);
    });
  }

  signOut() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  get name() {
    return this.form.get('name');
  }

  get playerClass() {
    return this.form.get('playerClass');
  }

  get sendPlayer() {
    return this.sendForm.get('sendPlayer');
  }

  get text() {
    return this.sendForm.get('text');
  }

}
