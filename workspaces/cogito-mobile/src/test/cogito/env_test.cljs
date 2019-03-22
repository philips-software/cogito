(ns cogito.env-test
  (:require [cljs.test :refer (deftest is testing)]
            ["create-react-class" :as crc]
            [cogito.env :refer (register
                                register-component
                                create-wrapper
                                id-seq-ref
                                mounted-ref)]))

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
  (let [crc-arg (atom [nil])]
    (with-redefs [crc
                  (fn [js-struct] (reset! crc-arg js-struct))]

      (testing "creates a react component"
        (create-wrapper "MyComponent")
        (is (fn? (-> @crc-arg .-render)))) ;; has a 'render' method

      (testing "stores key in initial state"
        (create-wrapper "MyComponent")
        (let [initialState (.getInitialState @crc-arg)]
          (is (= (-> initialState .-key) "MyComponent"))))

      (testing "stores incrementing id in initial state"
        (reset! id-seq-ref 3)
        (create-wrapper "MyComponent")
        (let [initialState (.getInitialState @crc-arg)]
          (is (= (-> initialState .-id) 4))))

      (testing "keeps track of mounted components"
        (create-wrapper "MyComponent")
        (-> @crc-arg .componentDidMount)
        (is (not (nil? (get @mounted-ref "MyComponent"))))))))
