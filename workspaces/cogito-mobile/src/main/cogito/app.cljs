(ns cogito.app
  (:require [reagent.core :as r :refer [atom]]
            [cogito.identity-manager :as identity-manager]
            [cogito.home :as home]))

(def ReactNativeNavigation (js/require "react-native-navigation"))
(def navigation (.-Navigation ReactNativeNavigation))

(defn init []
  (println "hello shadow")
  (.registerComponent navigation "Home" #(r/reactify-component home/screen))
  (.registerComponent navigation "IdentityManager" #(r/reactify-component identity-manager/screen))
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
