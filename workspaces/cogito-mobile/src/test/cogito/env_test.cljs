(ns cogito.env-test
  (:require [cljs.test :refer (deftest is testing use-fixtures)]
            ["create-react-class" :as crc]
            [cogito.env :refer (register
                                register-component
                                add-screen
                                id-seq-ref
                                screens-ref
                                mounted-ref)]))

(defn reset-globals []
  (reset! id-seq-ref 0)
  (reset! mounted-ref {})
  (reset! screens-ref {}))

(def wrapper-def (atom nil))

(defn setup-test [test]
  (reset-globals)
  (reset! wrapper-def nil)
  (with-redefs [crc
                (fn [js-struct]
                  (reset! wrapper-def js-struct))]
    (test)))

(use-fixtures :each setup-test)

(deftest register-calls-register-component
  (let [register-component-call-count (atom 0)]
    (with-redefs [register-component
                  (fn [key wrapperFn]
                    (swap! register-component-call-count inc))]
      (testing "it calls register-component"
        (register "Home")
        (is (= 1 @register-component-call-count))))))

(deftest wrapper-has-display-name
  (register "Home")
  (is (= "HomeWrapper" (-> @wrapper-def .-displayName))))

(deftest register-assigns-initial-state
  (register "Home")
  (let [getInitialState (-> @wrapper-def .-getInitialState)]
    (is (= 1 (-> (getInitialState) .-id)))))

(deftest register-assignes-incrementing-id
  (register "Home")
  (register "SomeOtherComponent")
  (let [getInitialState (-> @wrapper-def .-getInitialState)]
    (is (= 2 (-> (getInitialState) .-id)))))

(deftest register-assigns-same-key-as-wrapped-component
  (register "Home")
  (let [getInitialState (-> @wrapper-def .-getInitialState)]
    (is (= "Home" (-> (getInitialState) .-key)))))

(deftest wrapper-stores-mounted-component
  (register "Home")
  (let [wrapper @wrapper-def]
    (goog/object.set wrapper "state" #js {:id 1})
    (.componentDidMount wrapper)
    (is (= wrapper (get-in @mounted-ref ["Home", 1])))))

(deftest wrapper-removes-unmounted-component
  (register "Home")
  (let [wrapper @wrapper-def]
    (goog/object.set wrapper "state" #js {:id 1})
    (.componentDidMount wrapper)
    (.componentWillUnmount wrapper)
    (is (= {} (get @mounted-ref "Home")))))

(deftest wrapped-component-is-rendered-with-component-id
  (register "Home")
  (let [received-component-id (atom nil)
        wrapper @wrapper-def]
    (add-screen "Home" {:render
                        (fn [{:keys [component-id] :as props}] (reset! received-component-id component-id) {:div "bla"})})
    (goog/object.set wrapper "state" #js {:id 1})
    (goog/object.set wrapper "props" #js {:componentId 42})
    (.render wrapper)
    (is (= 42 @received-component-id))))

(deftest wrapper-forwards-navigation-button-pressed
  (register "Home")
  (let [received-props (atom nil)
        wrapper @wrapper-def]
    (add-screen "Home" {:navigation-button-pressed
                        (fn [props] (reset! received-props props))})
    (goog/object.set wrapper "state" #js {:id 1})
    (goog/object.set wrapper "props" #js {:componentId 42})
    (.navigationButtonPressed wrapper)
    (is (= 42 (get @received-props :component-id)))))
