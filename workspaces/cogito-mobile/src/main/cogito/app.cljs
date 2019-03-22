(ns cogito.app
  (:require
   [reagent.core :as r :refer [atom]]
   ["react-native" :as ReactNative]
   ["react-native-navigation" :as rnn]
   [cogito.env :as env]
   [cogito.home :as home]
   [cogito.identity-manager :as identity-manager]
   [cogito.create-identity :as create-identity]))

(defn init []
  (env/register "Home")
  (env/register "IdentityManager")
  (env/register "CreateIdentity")

  (-> (rnn/Navigation.events)
      (.registerAppLaunchedListener
       (fn []
         (->> {:root
               {:stack
                {:children [{:component {:name "Home"}}]
                 :options {:topBar {:visible "false"}}}}}
              (clj->js)
              (rnn/Navigation.setRoot))))))
