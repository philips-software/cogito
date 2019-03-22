(ns cogito.identity-manager
  (:require
   [reagent.core :as r :refer [atom]]
   ["react-native" :as rn]
   ["react-native-navigation" :as ReactNativeNavigation :refer (Navigation)]
   [cogito.create-identity :as create-identity]
   [cogito.toolbar-button :as btn :refer [toolbar-button]]
   [cogito.env :as env]))

(env/add-screen
 "IdentityManager"
 {:navigation-button-pressed
  #(.showModal Navigation create-identity/modal-presentation-layout)

  :render
  (fn [props]
    [:> rn/View {:style {:flex-direction "column"
                         :margin 40
                         :align-items "center"}}

     [:> rn/Text {:style {:font-size 30
                          :font-weight "100"
                          :margin-bottom 20
                          :text-align "center"}}
      "Identities"]])})

(def push-options
  {:topBar {:visible "true"
            :title {:text "Me, myself and I"}
            :rightButtons [(toolbar-button "add")]}})