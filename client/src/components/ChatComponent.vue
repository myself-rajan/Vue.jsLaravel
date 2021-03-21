<template>
  <div class="row">
    <div class="col-8">
      <div class="card card-default">
        <div class="card-header">Messages</div>
        <div class="card-body p-0">
          <ul
            class="list-unstyled"
            style="height:300px; overflow-y:scroll"

          >
          <!-- v-chat-scroll -->
            <li class="p-2" v-for="(message, index) in messages" :key="index">
              <!-- <strong>{{ message.user.name }}</strong> -->
              {{ message.message }}
            </li>
          </ul>
        </div>

        <input
          @keydown="sendTypingEvent"
          @keyup.enter="sendMessage"
          v-model="newMessage"
          type="text"
          name="message"
          placeholder="Enter your message..."
          class="form-control"
        />
      </div>
      <!-- <span class="text-muted" v-if="activeUser"
        >{{ activeUser.name }} is typing...</span
      > -->
    </div>

    <div class="col-4">
      <div class="card card-default">
        <div class="card-header">Active Users</div>
        <div class="card-body">
          <ul>
            <!-- <li class="py-2" v-for="(user, index) in users" :key="index">
              {{ user.name }}
            </li> -->
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Echo from 'laravel-echo'
const axios = require('axios')
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
export default {
  props: ['user'],
  data () {
    return {
      messages: [],
      newMessage: '',
      users: [],
      activeUser: false,
      typingTimer: false
    }
  },
  created () {
    window.Pusher = require('pusher-js')

    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'f18ead0fa8750c93afd7',
      cluster: 'ap2',
      encrypted: true
    })
    this.fetchMessages()
    window.Echo.join('chat')
      .here(user => {
        this.users = user
      })
      .joining(user => {
        this.users.push(user)
      })
      .leaving(user => {
        this.users = this.users.filter(u => u.id !== user.id)
      })
      .listen('ChatEvent', event => {
        this.messages.push(event.chat)
      })
      .listenForWhisper('typing', user => {
        this.activeUser = user
        if (this.typingTimer) {
          clearTimeout(this.typingTimer)
        }
        this.typingTimer = setTimeout(() => {
          this.activeUser = false
        }, 1000)
      })
  },
  methods: {
    fetchMessages () {
      // axios.get('messages').then(response => {
      //   this.messages = response.data
      // })
    },
    sendMessage () {
      this.messages.push({
        user: this.user,
        message: this.newMessage
      })
      console.log('AXIOS : ', axios)
      axios.get('http://127.0.0.1:8000/api/messages')
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
        .then(function () {
        })
      // axios.post('messages', { message: this.newMessage }) call recive kigiye
      this.newMessage = ''
    },
    sendTypingEvent () {
      window.Echo.join('chat').whisper('typing', this.user)
      console.log(this.user + ' is typing now')
    }
  }
}
</script>
