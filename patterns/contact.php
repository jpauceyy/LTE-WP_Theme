<?php
/**
 * Title: Contact page
 * Slug: lte/contact
 * Description: Full "Contact page" layout built from core blocks.
 * Categories: lte
 * Viewport Width: 1440
 */
?>
<!-- wp:group {"tagName":"section","anchor":"top","className":"page-hero","layout":{"type":"default"}} -->
<section id="top" class="wp-block-group page-hero">
<!-- wp:group {"className":"wrap ph-grid","layout":{"type":"default"}} -->
<div class="wp-block-group wrap ph-grid">
<!-- wp:group {"layout":{"type":"default"}} -->
<div class="wp-block-group">
<!-- wp:paragraph {"className":"crumbs"} -->
<p class="crumbs"><a href="/">Home</a> / Contact</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"pill"} -->
<p class="pill">We reply within 2 working days</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":1,"className":"rise"} -->
<h1 class="wp-block-heading rise">Get in <em>touch.</em></h1>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"sub rise"} -->
<p class="sub rise">Questions about the Telegram, getting set up with Vantage, or working together? Send a message and Luke will get back to you.</p>
<!-- /wp:paragraph -->
<!-- wp:html -->
<div class="c-side rise"><a href="https://t.me/learntryearn" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.4 4.3 2.9 11.5c-1.1.4-1 1.9.1 2.2l4.6 1.4 1.8 5.5c.3.9 1.4 1.1 2 .4l2.6-2.6 4.9 3.6c.7.5 1.7.1 1.9-.8l3-14.9c.2-1-.8-1.9-1.8-1.5Z"/></svg><span>Telegram<small>Fastest for trade questions</small></span></a>
<a href="https://www.tiktok.com/@learntryearn" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.4 2.3 1.9 3.8 4.4 4v3.1a8 8 0 0 1-4.4-1.3v6.4a5.8 5.8 0 1 1-5.8-5.8l.9.1v3.2a2.7 2.7 0 1 0 1.9 2.6V3h3Z"/></svg><span>TikTok<small>Ask during a live session</small></span></a></div>
<!-- /wp:html -->
</div>
<!-- /wp:group -->
<!-- wp:group {"className":"rise","layout":{"type":"default"}} -->
<div class="wp-block-group rise">
<!-- wp:group {"anchor":"formCard","className":"glass","layout":{"type":"default"}} -->
<div id="formCard" class="wp-block-group glass">
<!-- wp:html -->
<form class="cform" id="contactForm" action="https://formsubmit.co/contact@lukefenners.com" method="POST" novalidate>
          <input type="hidden" name="_subject" value="New message from the Learn Try Earn website">
          <input type="hidden" name="_template" value="box">
          <input type="hidden" name="_captcha" value="false">
          <input type="hidden" name="_next" value="">
          <input type="hidden" name="_autoresponse" value="Thanks for getting in touch with Learn Try Earn. We've received your message and Luke will reply within 2 working days. In the meantime, join the Telegram at https://t.me/learntryearn or watch live at https://www.tiktok.com/@learntryearn. Educational content, not financial advice.">
          <div class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="_honey" tabindex="-1" autocomplete="off"></label></div>
          <div class="row2">
            <div class="field"><label for="cName">Name</label><input id="cName" name="name" type="text" autocomplete="name" required placeholder="Your name"></div>
            <div class="field"><label for="cEmail">Email</label><input id="cEmail" name="email" type="email" autocomplete="email" required placeholder="you@example.com"></div>
          </div>
          <div class="field"><label for="cTopic">What’s it about?</label>
            <select id="cTopic" name="topic">
              <option>General question</option>
              <option>Telegram group</option>
              <option>Getting started with Vantage</option>
              <option>Business or collaboration</option>
              <option>Something else</option>
            </select>
          </div>
          <div class="field"><label for="cMsg">Message</label><textarea id="cMsg" name="message" required placeholder="How can we help?"></textarea></div>
          <label class="consent"><input type="checkbox" name="consent" value="Yes" required><span>I’m happy for Learn Try Earn to reply to me by email about this message.</span></label>
          <p class="form-err" id="formErr" role="alert" hidden></p>
          <button class="btn btn-lime" type="submit" id="cSubmit">Send message</button>
          <p class="mono final-note" style="margin:0">We never give investment advice by email.</p>
        </form>
<div class="sent" id="formSent" tabindex="-1" hidden>
          <span class="tick" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>
          <h2>Message <em>sent.</em></h2>
          <p id="sentText">Thanks for getting in touch. We’ve emailed you a confirmation, and Luke will reply within 2 working days.</p>
          <div class="btns" style="justify-content:center">
            <a class="btn btn-lime" href="https://t.me/learntryearn" rel="noopener" target="_blank">Join our Telegram</a>
            <a class="btn btn-line" href="/" target="_top">Back to home</a>
          </div>
        </div>
<!-- /wp:html -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
</section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","className":"finale","layout":{"type":"default"}} -->
<section class="wp-block-group finale">
<!-- wp:group {"className":"wrap","layout":{"type":"default"}} -->
<div class="wp-block-group wrap">
<!-- wp:group {"className":"final-card glass","layout":{"type":"default"}} -->
<div class="wp-block-group final-card glass">
<!-- wp:html -->
<span class="lte-mark m-final" aria-hidden="true"><i class="m-l"></i><i class="m-a"></i></span>
<!-- /wp:html -->
<!-- wp:paragraph {"className":"pill rise"} -->
<p class="pill rise">Live on TikTok, entries on Telegram</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"className":"rise"} -->
<h2 class="wp-block-heading rise">Learn the process, <em>step by step.</em></h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"rise"} -->
<p class="rise">Join the Telegram for entries and analysis, and watch the full process live on TikTok.</p>
<!-- /wp:paragraph -->
<!-- wp:buttons {"className":"btns rise"} -->
<div class="wp-block-buttons btns rise">
<!-- wp:button {"className":"btn-lime ico-telegram"} -->
<div class="wp-block-button btn-lime ico-telegram"><a class="wp-block-button__link wp-element-button" href="https://t.me/learntryearn" target="_blank" rel="noopener">Join our Telegram</a></div>
<!-- /wp:button -->
<!-- wp:button {"className":"btn-line ico-play"} -->
<div class="wp-block-button btn-line ico-play"><a class="wp-block-button__link wp-element-button" href="https://www.tiktok.com/@learntryearn" target="_blank" rel="noopener">Watch us live on TikTok</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
<!-- wp:paragraph {"className":"mono final-note rise"} -->
<p class="mono final-note rise">Educational content, not financial advice. Trading involves significant risk.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
</section>
<!-- /wp:group -->
