/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";
import ChatComponent from "@/components/ChatComponent";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "ChatComponent",
      component: ChatComponent
    }
  ]
});
