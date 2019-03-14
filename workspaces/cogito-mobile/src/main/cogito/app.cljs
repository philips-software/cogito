(ns cogito.app
  (:require
   [reagent.core :as r :refer [atom]]
   ["react-native" :as ReactNative]
   ["react-native-navigation" :as ReactNativeNavigation :refer (Navigation)]
   ["create-react-class" :as crc]
   [cogito.home :as home]
   [cogito.identity-manager :as identity-manager]
   [cogito.create-identity :as create-identity]))

(defonce root-ref (atom nil))
(defonce reload-wrapper-ref (atom nil))

(defn reload-wrapper [component-name root]
  (let [first-call? (nil? @root-ref)]
    (println "reload wrapper ref" @reload-wrapper-ref)
    (reset! root-ref (r/as-element [root]))
    (if-not first-call?
      (when-let [wrapper @reload-wrapper-ref]
        (println "!!! force update !!!")
        (.forceUpdate wrapper))
      (let [wrapper (crc #js
                          {:displayName "ReloadWrapper"

                           :componentDidMount
                           (fn []
                             (println "wrapper did mount")
                             (this-as this (reset! reload-wrapper-ref this)))

                           :componentWillUnmount
                           (fn [] (reset! reload-wrapper-ref nil))

                           :render
                           (fn []
                             (this-as this
                                      (js/console.log (.-props this) @root-ref)
                                      (let [body @root-ref]
                                        body)))})] ;; todo pass props to body somehow

        (.registerComponent Navigation
                            component-name
                            (fn [] wrapper)
                            #(r/reactify-component root))
        (.registerComponent Navigation "IdentityManager" identity-manager/screen)
        (.registerComponent Navigation "CreateIdentity" create-identity/screen)))))

(defn init {:dev/after-load true} []
  (reload-wrapper "Home" home/screen)

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
