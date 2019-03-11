(ns cogito.toolbar-button
  (:require
   ["react-native" :as ReactNative]))

(def platform (.-Platform ReactNative))

(defn toolbar-button-android [id] {:id id :text id})
(defn toolbar-button-ios [id] {:id id :systemItem id})

(defn toolbar-button [id]
  (if (= "ios" (.-OS platform))
    (toolbar-button-ios id)
    (toolbar-button-android id)))
