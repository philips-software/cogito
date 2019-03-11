(ns cogito.home
  (:require [reagent.core :as r :refer [atom]]
            ["react-native" :as rn]
            ["react-native-navigation" :as ReactNativeNavigation :refer (Navigation)]
            [cogito.identity-manager :as identity-manager]))

(defn show-identity-manager [componentId]
  (.push
   Navigation
   componentId
   #js {:component #js {:name "IdentityManager"
                        :options identity-manager/push-options}}))

(defn screen [props]
  [:> rn/View {:style {:flex-direction "column"
                       :margin 40
                       :align-items "center"}}

   [:> rn/Text {:style {:font-size 30
                        :font-weight "100"
                        :margin-bottom 20
                        :text-align "center"}}
    "Hi Shadow CLJS!"]

   [:> rn/Button {:title "Press me"
                  :on-press #(show-identity-manager (:componentId props))}]])
