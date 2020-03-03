import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import glamorous from 'glamorous'
import cogitoSignVideo from './video/cogito-sign.mp4'
import cogitoScanVideo from './video/cogito-scan.mp4'

const page = () => <Page>
  <Helmet title='Cogito' />
  <h1>Cogito - <Smaller>friendly and private identities</Smaller></h1>
  <Section>
    <RightVideo autoPlay>
      <source src={cogitoScanVideo} type='video/mp4' />
    </RightVideo>
    <h3>Easy login</h3>
    <p>
      Simply scan a QR code once. That is all it takes to use your Cogito
      identity on a website.
    </p>
  </Section>
  <Section>
    <h3>Privacy guaranteed</h3>
    <p>
      Cogito allows you to separate your working life from your private life by
      creating multiple facets of your identity. You control all facets and can
      choose which facets you present to websites.
    </p>
  </Section>
  <Section>
    <LeftVideo autoPlay>
      <source src={cogitoSignVideo} type='video/mp4' />
    </LeftVideo>
    <h3>Blockchain transactions</h3>
    <p>
      With Cogito you can quickly sign Ethereum transactions without the hassle.
      Your keys will remain safely on your phone. You remain in control of your
      identity.
    </p>
  </Section>
  <Section>
    <h3>For Developers</h3>
    <p>
      Provide a hassle free user experience for your Ethereum web app. Learn how
      to integrate Cogito into your web app by following
      the <Link to='/developer-documentation/tutorial'>tutorial</Link>, or browse
      the <Link to='/developer-documentation/introduction'>documentation</Link>.
    </p>
  </Section>
</Page>

const Page = glamorous.div({
  marginTop: '3rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: '40rem'
})

const Smaller = glamorous.span({
  fontSize: 'smaller'
})

const Section = glamorous.div({ clear: 'both', marginTop: '2rem', marginBottom: '2rem' })

const LeftVideo = glamorous.video({
  float: 'left',
  height: '8rem',
  marginRight: '3rem',
  marginTop: '1rem',
  marginBottom: '2rem'
})

const RightVideo = glamorous.video({
  float: 'right',
  height: '8rem',
  marginLeft: '3rem',
  marginTop: '1rem',
  marginBottom: '2rem'
})

export default page
