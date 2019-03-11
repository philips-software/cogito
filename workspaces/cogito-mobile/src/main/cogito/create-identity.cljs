(ns cogito.create-identity
  (:require [reagent.core :as r :refer [atom]]))

(def ReactNative (js/require "react-native"))
(def view (r/adapt-react-class (.-View ReactNative)))
(def text (r/adapt-react-class (.-Text ReactNative)))

(defn screen []
  [view {:style {:flex-direction "column" :margin 40 :align-items "center" :background-color "white"}}
   [text {:style {:font-size 30 :font-weight "100" :margin-bottom 20 :text-align "center"}} "Create Identity"]])
