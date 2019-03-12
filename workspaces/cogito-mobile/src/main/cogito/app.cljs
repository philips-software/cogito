(ns cogito.app
  (:require
   [reagent.core :as r :refer [atom]]
   ["react-native" :as ReactNative]
   ["react-native-navigation" :as ReactNativeNavigation :refer (Navigation)]
   ["create-react-class" :as crc]
   [cogito.home :as home]
   [cogito.identity-manager :as identity-manager]
   [cogito.create-identity :as create-identity]))

(defn reload-wrapper [component-name root]
  (let [wrapper (r/create-class
                 {:display-name "reload-wrapper"

                  :get-initial-state
                  (fn [] (print "new wrapper"))

                  :reagent-render root})]
    (.registerComponent Navigation
                        component-name
                        (fn [] wrapper)
                        #(r/reactify-component root))))

(defn init {:dev/after-load true} []
  (reload-wrapper "Home" home/screen)
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
