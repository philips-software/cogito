(ns cogito.env-test
  (:require [cljs.test :refer (deftest is testing)]
            [cogito.env :refer (register register-component)]))

(deftest register-test
  (testing "it calls register-component with the right key"
    (let [registered-key (atom nil)]
      (with-redefs [register-component
                    (fn [key component]
                      (reset! registered-key key))]
        (register "Home")
        (is (= "Home" @registered-key))))))