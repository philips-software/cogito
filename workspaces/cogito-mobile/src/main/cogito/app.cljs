(ns cogito.app
  (:require [reagent.core :as r :refer [atom]]
            [cogito.home :as home]
            [cogito.identity-manager :as identity-manager]
            [cogito.create-identity :as create-identity]))

(def ReactNativeNavigation (js/require "react-native-navigation"))
(def navigation (.-Navigation ReactNativeNavigation))

(defn init []
  (.registerComponent navigation "Home" #(r/reactify-component home/screen))
  (.registerComponent navigation "IdentityManager" identity-manager/screen)
  (.registerComponent navigation "CreateIdentity" create-identity/screen)

  (let [events (.events navigation)]
    (.registerAppLaunchedListener
     events
     #(.setRoot
       navigation
       #js {:root #js
                   {:stack #js
                            {:children #js [#js
                                             {:component #js
                                                          {:name "Home"}}]
                             :options #js {:topBar #js {:visible "false"}}}}}))))
