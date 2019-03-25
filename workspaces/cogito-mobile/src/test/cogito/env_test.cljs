(ns cogito.env-test
  (:require [cljs.test :refer (deftest is testing use-fixtures)]
            ["create-react-class" :as crc]
            [cogito.env :refer (register register-component)]))

(def wrapper-def (atom nil))

(defn setup-test [test]
  (with-redefs [crc
                (fn [js-struct] (reset! wrapper-def js-struct))]
    (reset! wrapper-def nil)
    (register "Home")
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

(deftest register-tests
  (let [getInitialState (-> @wrapper-def .-getInitialState)]
    (testing "it gets an id"
      (is (= 1 (-> (getInitialState) .-id))))

    (testing "a second component gets the next id"
      (register "SomeOtherComponent")
      (is (= 2 (-> (getInitialState) .-id))))

    (testing "it gets the same key as the wrapped component"
      (is (= "Home" (-> (getInitialState) .-key))))))