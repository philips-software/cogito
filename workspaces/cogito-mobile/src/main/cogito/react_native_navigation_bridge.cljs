(ns cogito.react-native-navigation-bridge
  (:require ["react-native-navigation" :as rnn]))

(defn register-component [key component]
  (rnn/Navigation.registerComponent key component))

(defn bind-component [component]
  (-> (rnn/Navigation.events)
      (.bindComponent this)))