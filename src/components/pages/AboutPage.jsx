import React from 'react';
import { Page, Navbar, Link, Block, BlockTitle } from 'framework7-react';

export default () => (
  <Page colorTheme="cavaliers-yellow">
    <Navbar title="About" backLink="Back"></Navbar>
    <BlockTitle>How does it work?</BlockTitle>
    <Block strong>
      <p>The main principle of losing weight is CICO (Calories In, Calories Out). In other words, in order to lose weight, you have to burn more calories than you intake.</p>
      <p>This app can calculate and visualize your weight loss progress based on some parameters. The calculation itself is based on <a href="https://en.wikipedia.org/wiki/Harris–Benedict_equation">Harris-Benedict equations</a> (revised by Mifflin and St. Jeor).</p>
    </Block>
  </Page>
);
