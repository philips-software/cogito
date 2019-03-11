(ns cogito.app
  (:require
   [reagent.core :as r :refer [atom]]
   ["react-native" :as ReactNative]
   ["react-native-navigation" :as ReactNativeNavigation :refer (Navigation)]
   [cogito.home :as home]
   [cogito.identity-manager :as identity-manager]
   [cogito.create-identity :as create-identity]))

(defn init {:dev/after-load true} []
  (.registerComponent Navigation "Home" #(r/reactify-component home/screen))
  (.registerComponent Navigation "IdentityManager" identity-manager/screen)
  (.registerComponent Navigation "CreateIdentity" create-identity/screen)

  (let [events (.events Navigation)]
    (.registerAppLaunchedListener
     events
     #(.setRoot
       Navigation
       #js {:root #js
                   {:stack #js
                            {:children #js [#js
                                             {:component #js
                                                          {:name "Home"}}]
                             :options #js {:topBar #js {:visible "false"}}}}}))))
