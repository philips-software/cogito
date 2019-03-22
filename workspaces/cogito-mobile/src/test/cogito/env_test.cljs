(ns cogito.env-test
  (:require [cljs.test :refer (deftest is testing)]
            ["create-react-class" :as crc]
            [cogito.env :refer (register register-component create-wrapper)]))

(deftest register-test
  (testing "it calls register-component and create-wrapper"
    (let [registered-key (atom nil)
          create-wrapper-count (atom 0)]
      (with-redefs [register-component
                    (fn [key component]
                      (reset! registered-key key))

                    create-wrapper
                    (fn [key]
                      (swap! create-wrapper-count inc))]
        (register "Home")
        (is (= "Home" @registered-key))
        (is (= 1 @create-wrapper-count))))))

(deftest create-wrapper-test
  (testing "creates a react component"
    (let [crc-arg (atom nil)]
      (with-redefs [crc
                    (fn [js-struct] (reset! crc-arg js-struct))]
        (create-wrapper "MyComponent")
        (is (fn? (-> @crc-arg .-render)))))) ;; has a 'render' method

  (testing "stores key in initial state"
    (let [crc-arg (atom nil)]
      (with-redefs [crc
                    (fn [js-struct] (reset! crc-arg js-struct))]
        (create-wrapper "MyComponent")
        (let [initialState (.getInitialState @crc-arg)]
          (is (= (-> initialState .-key) "MyComponent"))))))

  (testing "stores incrementing id in initial state"
    (let [crc-arg (atom nil)]
      (with-redefs [crc
                    (fn [js-struct] (reset! crc-arg js-struct))]
        (create-wrapper "MyComponent")
        (let [initialState (.getInitialState @crc-arg)]
          (is (= (-> initialState .-id) 1)))))))
