(ns cogito.home
  (:require [reagent.core :as r :refer [atom]]
            ["react-native" :as ReactNative]
            ["react-native-navigation" :as ReactNativeNavigation :refer (Navigation)]
            [cogito.identity-manager :as identity-manager]))

(def text (r/adapt-react-class (.-Text ReactNative)))
(def view (r/adapt-react-class (.-View ReactNative)))
(def button (r/adapt-react-class (.-Button ReactNative)))

(defn show-identity-manager [componentId]
  (.push
   Navigation
   componentId
   #js {:component #js {:name "IdentityManager"
                        :options identity-manager/push-options}}))

(defn screen [props]
  [view {:style {:flex-direction "column"
                 :margin 40
                 :align-items "center"
                 :background-color "white"}}

   [text {:style {:font-size 30
                  :font-weight "100"
                  :margin-bottom 20
                  :text-align "center"}}
    "Hi Shadow CLJS!"]

   [button {:title "Press me"
            :on-press #(show-identity-manager (:componentId props))}]])
