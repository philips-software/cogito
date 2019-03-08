(ns cogito.app
  (:require [reagent.core :as r :refer [atom]]))

(def ReactNative (js/require "react-native"))
(def ReactNativeNavigation (js/require "react-native-navigation"))

(def app-registry (.-AppRegistry ReactNative))
(def navigation (.-Navigation ReactNativeNavigation))
(def text (r/adapt-react-class (.-Text ReactNative)))
(def view (r/adapt-react-class (.-View ReactNative)))
(def button (r/adapt-react-class (.-Button ReactNative)))

(defn identity-manager []
  [view {:style {:flex-direction "column" :margin 40 :align-items "center" :background-color "white"}}
   [text {:style {:font-size 30 :font-weight "100" :margin-bottom 20 :text-align "center"}} "Hi Shadow CLJS!"]])

(defn push [componentId]
  (.push
   navigation
   componentId
   #js {:component #js {:name "IdentityManager"
                        :options #js {:topBar #js {:visible "true"
                                                   :title #js {:text "Me, myself and I"}}}}}))

(defn app-root [props]
  [view {:style {:flex-direction "column" :margin 40 :align-items "center" :background-color "white"}}
   [text {:style {:font-size 30 :font-weight "100" :margin-bottom 20 :text-align "center"}} "Hi Shadow CLJS!"]
   [button {:title "Press me" :on-press #(push (:componentId props))}]])

(defn init []
  (println "hello shadow")
  (.registerComponent navigation "Cogito" #(r/reactify-component app-root))
  (.registerComponent navigation "IdentityManager" #(r/reactify-component identity-manager))
  (let [events (.events navigation)]
    (.registerAppLaunchedListener
     events
     #(.setRoot
       navigation
       #js {:root #js
                   {:stack #js
                            {:children #js [#js
                                             {:component #js
                                                          {:name "Cogito"}}]
                             :options #js {:topBar #js {:visible "false"}}}}}))))
