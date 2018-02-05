# Cogito Identity Management Solution

In this document we present Cogito Identity Management Solution.

Our objective is to create possible broad and flexible identity management solution that can satisfy possible wide range of use-cases: private anonymous login (inCOGnITO), zero-knowledge verifiable-claims, public identity (DIDs), and facilitating login to existing OpenID providers. Finally, we also consider the use of Cogito for end-to-end encrypted storage.

## Private anonymous login (inCOGnITO)

This solution is inspired by the [Secure Quick Reliable Login](https://www.grc.com/sqrl/sqrl.htm). We all need to study that well to understand crypto and algorithms involved.

### Introduction zk-SNARKS

The goal of zero-knowledge proofs is for a *verifier* to be able to convince herself that a *prover* possesses knowledge of a secret parameter, called a *witness*, satisfying some relation, without revealing the witness to the verifier or anyone else.
We can think of this more concretely as having a program, denoted `C`, taking two inputs: `C(x, w)`. The input `x` is the public input, and `w` is the secret witness input. The output of the program is `boolean`, i.e. either `true` or `false`. The goal then is given a specific public input `x`, prove that the prover knows a secret input `w` such that `C(x,w) == true`.

A zk-SNARK consists of three algorithms `G`, `P`, `V`. A zk-SNARKS generator `G` takes two inputs: program *C* and a parameter *lambda*. The output of the generator are two keys: a *proving* key and a *verification* key, denoted `(pk, vk)` respectively. After generation the keys can be made public. The prover `P` takes as input the proving key `pk`, a public input `x` and a private witness `w`. The algorithm generates a proof `prf = P(pk, x, w)` that the prover knows a witness `w` and that the witness satisfies the program.
The verifier `V` computes `V(vk, x, prf)` which returns `true` if the proof is correct, and false otherwise. Thus this function returns true if the prover knows a witness w satisfying `C(x,w) == true`. Lambda has to be destroyed immediately after `vk` and `pk` has been generated. The reason for this is that anyone who knows this parameter can generate fake proofs. Specifically, given any program `C` and public input `x` a person who knows `lambda` can generate a proof `fake_prf` such that `V(vk, x, fake_prf)` evaluates to true without knowledge of the secret `w`.

It is therefore clear that the secret holder, the one who generates the proof `prf`, cannot be responsible for generating the `(pk, vk)` keys. Verifiers would have to have a high level of confidence in the prover to destroy `lambda`. For this reason, the generation should be performed the verifier who then distributes the keys to the provers.

For a more details about zk-SNARKS we recommend [Introduction to zk-SNARKs with examples](https://media.consensys.net/introduction-to-zksnarks-with-examples-3283b554fc3b), which fragments has been used above. For an example and spectacular approach of using multi-party-computation to bootstrap zk-SNARK we refer the reader to [The Design of the Ceremony](https://z.cash/blog/the-design-of-the-ceremony.html) and [Zcash Parameters And How They Will Be Generated](https://z.cash/blog/generating-zcash-parameters.html) from [Zcash](https://z.cash).

### Applying zk-SNARKS to verifiable claims

We describe the application of zk-SANRKs to verifiable claims using a running example where a student of a university can receive a discount when buying goods in a store that honors students of that university with this privilege.

Bob is a student of University of Twente (`ut`). Bob visits the university and requests a credential proving that he is a student of that university. After showing his id document, university issues the following credential to Bob:

```
ut.student <- bob
```

Here `bob` denotes a public key of a person that holds the corresponding private key (Bob in our case). Requesting the credential make this public key disclosed. If Bob, however, is consistent and uses different public key to identify himself by each service, his privacy will not suffer serious damage. Of course, we cannot forget that university can leak information as well.

A credential can be in a text form or it can be encoded in one of the available credential formats (usually XML). The credential is then signed by the university to protect its integrity. This is so that Bob can still prove his credential is correct to the university. As we will see, thanks to zk-SNARKs, Bob will never have to reveal his credential to anyone else and still be able to prove he is a student of the university. Let's see how.

Apart from singing the credential, the university also encrypts it with the public key of Bob (designed with `bob`) and delivers it to Bob (it is encrypted and only Bob can decrypt it, so it does not matter how the credential is delivered to Bob). The university also creates a *zero-knowledge credentials*, which is a signed tuple of the hash of the original credential `c`, and the role name *student*: `(H(c), 'student')`
To summarize If `c` is a signed credential then `zk(c)` will denote the signed zero-knowledge credential. `H(c)` will be the public input `x` to the zk-SNARKs algorithm and `c` will be the corresponding secret witness. Program `C`, the input to the generator `G`, will be:

```
x = H(c)
w = c
C = (x,w) => {
  return x === hash(w)
}
```

The store will run the generator `G` and will store the prover key `pk` and the verification key `vk`. These keys do not have to be protected. When Bob wants to prove that he is a student of the university, the store sends him the prover key `pk`. Using this key, the zero-knowledge credential, and the credential itself (after being decrypted - only Bob can decrypt the credential, so nobody else can create this proof), Bob creates a proof that he is a student of the university:

```
prf = P(pk, H(c), c)
``` 

To be precise, the university could also create such a proof as the issuer of the credential.

> The university can also leak information about all her students... 

In any case, university does not know the public key that Bob uses to identify himself at the store, and even more importantly university does not have access to the corresponding private key that Bob keeps in his secure element on his phone. Bob signs every message he exchanges with the store, and so he also signs the generated proof `prf`. The store receiving this proof can be assured that it was computed by the actual subject of the credential.

We could also use more complex verification function `C`:

```
x = enc(bob, H(c))
w = {c, priv(bob)}
C = (x, {c, k}) => {
  return (dec(k, x)) === hash(c))
}
```

Here, the pubic input is the encrypted hashed credential and the secret witness has two components: the credential itself (again after being decrypted) and the private key corresponding to the public key used in the credential.

The disadvantage of this solution would be that the verification function becomes far more cryptographically-heavy and that it requires the private key as the input. This would effectively forbid the prover from keeping the private key in the secrete element of the device.

Bob will store `zk(c)`. When Bob wants to prove to the store that he is a student of the university he provides the zero-knowledge credential to the store. In order to verify that Bob is indeed a student of the university, the store performs the following steps:

1. Verify the signature on the `zk(c)` using the public key of University of Twente.
2. Check that the role (`student` in our case) specified in `zk(c)` matches the required discount role.
3. Assert that `V(vk, H(c), prf) === true`.

The store does not know the actual Bob's identity. The store only knows one of Bob's identities - the one that Bob uses to authenticate himself with the store. Recall that Bob uses different identity for each and every service, including the university.

## Cogito and Decentralized Identifiers (DIDs)

The [Secure Quick Reliable Login](https://www.grc.com/sqrl/sqrl.htm) solution focuses on the secure login process. [Decentralized Identifiers (DIDs)](https://w3c-ccg.github.io/did-spec/) aims at further strengthening the user's control of her identity. DIDs still allow for multiple identities, each one being persistent and immutable, bound to an underlaying distributed ledger (even multiple underlying distributed ledger ledger over time).

The [DID Auth](https://github.com/WebOfTrustInfo/rebooting-the-web-of-trust-spring2017/blob/master/topics-and-advance-readings/did-auth.md) specification from the [The DID Family of Specifications](https://github.com/WebOfTrustInfo/rebooting-the-web-of-trust-spring2017/blob/master/topics-and-advance-readings/did-family-of-specifications.md) explains the subtle difference between authenticating as the owner of an *identifier* versus the owner of a *specific key*:

> The extra level of indirection allows the individual to manage key rotation, delegation of authority, synchronization across devices and more in a manner which is fully under their control and transparent to the relying party. An open specification for authentication using an identifier on a distributed ledger could be highly secure and interoperable while still being easy for users and protecting their privacy.

For this reason we need to consider the benefits of being compliant with DIDs and how to apply it the Cogito Identity Management system.

Please join the discussion on how to integrate DIDs with Cogito by adding content and comments in [DIDs for Cogito self-sovereign identity solution](https://confluence.atlas.philips.com/display/BLA/DIDs+for+Cogito+self-sovereign+identity+solution) document.

Cogito for OpenID providers

TBD...


## End-to-end encrypted storage

It is very educative to study the documentation of [keybase.io](https://keybase.io/). Even though keybase is not explicit about it, its crypto shares a lot with [Secure Quick Reliable Login](https://www.grc.com/sqrl/sqrl.htm). In particular, the following documents from [Keybase Crypto Documents](https://keybase.io/docs/crypto/overview) will be a valuable input:

1. [Crypto spec: the Keybase filesystem (KBFS)](https://keybase.io/docs/crypto/kbfs)
2. [Local Key Security](https://keybase.io/docs/crypto/local-key-security)

