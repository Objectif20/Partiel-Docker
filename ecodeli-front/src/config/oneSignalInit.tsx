"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { ProfileAPI } from "@/api/profile.api";
import { useTranslation } from "react-i18next";

export default function OneSignalInit() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const initOneSignal = async () => {
      await OneSignal.init({
        appId: import.meta.env.VITE_ONE_SIGNAL_APP_ID,
        language: i18n.language || "fr",
        serviceWorkerPath: "myPath/OneSignalSDKWorker.js",
        serviceWorkerParam: { scope: "/myPath/myCustomScope/" },
        
        



      });
      {/* 
                promptOptions: {
          slidedown: {
            prompts: [
              {
                type: "push",
                autoPrompt: true,
                delay: {
                  pageViews: 1,
                  timeDelay: 5,
                },
                text: {
                  actionMessage: t("pages.notif.slidedown.actionMessage"),
                  acceptButton: t("pages.notif.slidedown.acceptButton"),
                  cancelMessage: t("pages.notif.slidedown.cancelMessage"),
                  confirmMessage: t("pages.notif.slidedown.confirmMessage"),
                  emailLabel: t("pages.notif.slidedown.emailLabel"),
                  negativeUpdateButton: t("pages.notif.slidedown.negativeUpdateButton"),
                  positiveUpdateButton: t("pages.notif.slidedown.positiveUpdateButton"),
                  smsLabel: t("pages.notif.slidedown.smsLabel"),
                  updateMessage: t("pages.notif.slidedown.updateMessage"),
                },
                categories: []
              },
            ],
          },
        },

        welcomeNotification: {
          title: t("pages.notif.welcome.title"),
          message: t("pages.notif.welcome.message"),
          url: "https://ton-site.fr",
        },

        notifyButton: {
          enable: true,
          prenotify: true,
          showCredit: false,
          position: "bottom-right",
          text: {
            "dialog.blocked.message": t("pages.notif.dialog.blocked.message"),
            "dialog.blocked.title": t("pages.notif.dialog.blocked.title"),
            "dialog.main.button.subscribe": t("pages.notif.dialog.main.button.subscribe"),
            "dialog.main.button.unsubscribe": t("pages.notif.dialog.main.button.unsubscribe"),
            "dialog.main.title": t("pages.notif.dialog.main.title"),
            "message.action.resubscribed": t("pages.notif.message.action.resubscribed"),
            "message.action.subscribed": t("pages.notif.message.action.subscribed"),
            "message.action.subscribing": t("pages.notif.message.action.subscribing"),
            "message.action.unsubscribed": t("pages.notif.message.action.unsubscribed"),
            "message.prenotify": t("pages.notif.message.prenotify"),
            "tip.state.blocked": t("pages.notif.tip.state.blocked"),
            "tip.state.subscribed": t("pages.notif.tip.state.subscribed"),
            "tip.state.unsubscribed": t("pages.notif.tip.state.unsubscribed"),
          },
        },*/}

      OneSignal.Debug.setLogLevel("0");

      const isPushEnabled = OneSignal.Notifications.permission === true;
      if (isPushEnabled) {
        const userId = OneSignal.User.PushSubscription.id;
        if (userId) {
          try {
            await ProfileAPI.registerNotification(userId);
          } catch (error) {
            console.error("Notification registration failed:", error);
          }
        }
      }
    };

    initOneSignal();
  }, [i18n.language]);

  return null;
}
