<?php
/**
 * Contains markup for the home page in starter content.
 *
 * @package Prime
 *
 * @since 2.0.0
 */

$crio_icons = function( $options ) { ?>
	<div class="row">
		<?php foreach ( $options as $option ) { ?>
		<div class="col-md-4 col-sm-12 col-xs-12">
			<div class="bg-box text-center color2-background-alpha color-2-text-contrast" style="padding: 1.5em; margin: 1em 0;">
				<h4 class="color-2-text-contrast"><?php print esc_html( $option['title'] ) ?></h4>
				<p class="">Building brand integration and possibly funnel users.</p>
			</div>
		</div>
		<?php } ?>
	</div>
<?php }; ?>

<div class="boldgrid-section" data-bg-overlaycolor="rgba(0,0,0,0.5)" data-image-url="<?php $crio_image_path( 'typing-on-laptop-closeup.jpg' ) ?>" style="color: #fff; background-position: 50% 60%; background-size: cover;background-image: linear-gradient(to left, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(<?php $crio_image_path( 'typing-on-laptop-closeup.jpg' ) ?>)">
	<div class="container">
		<div class="row row-spacing-lg">
			<div class="col-md-6 col-sm-12 col-xs-12">
				<h2 class="h1" style="color: #fff; margin-top: 0;">Grow Your Business</h2>
				<?php $crio_divider(); ?>
				<p class="" style="margin-bottom: 2em; color: #fff; font-size: 1.2em;">Taking core competencies to infiltrate new markets. Drive analytics so that as an end result.</p>
				<p class=""><a href="#" class="button-primary">Learn More</a></p>
			</div>
			<div class="col-md-6 col-sm-12 col-xs-12"></div>
		</div>
	</div>
</div>
<div class="boldgrid-section">
	<div class="container">
		<div class="row row-spacing-lg">
			<div class="col-md-6 col-sm-6 col-xs-12">
				<h2 style="margin-top: 0;">Our Story</h2>
				<?php $crio_divider(); ?>
				<p style="margin-bottom: 2em;">Executing big data with the aim to improve overall outcomes. Build user stories so that as an end result, we create actionable insights. Engage audience segments and above all, use best practice. Target key demographics while remembering to get buy in.</p>
				<p style="margin-bottom: 2em;">Generating dark social so that as an end result, we use best practice. Synchronizing first party data so that we be transparent.</p>
				<p style="margin-bottom: 2em;"><a href="#" class="button-primary">Learn More</a></p>
			</div>
			<div class="col-md-1 col-sm-1 col-xs-12"></div>
			<div class="col-md-5 col-sm-5 col-xs-12 align-column-center">
				<p class="text-center"><img class="bg-img bg-img-3" src="<?php $crio_image_path( 'people-in-office.jpg' ) ?>"></p>
			</div>
		</div>
	</div>
</div>
<div class="boldgrid-section" data-bg-overlaycolor="rgba(0,0,0,0.5)" data-image-url="<?php $crio_image_path( 'desk-with-computer-and-chair.jpg' ) ?>" style="color: #fff; background-position: 50% 60%; background-size: cover;background-image: linear-gradient(to left, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(<?php $crio_image_path( 'desk-with-computer-and-chair.jpg' ) ?>)">
	<div class="container">
		<div class="row row-spacing-lg-top">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<h2 style="color: #fff; margin-top: 0;">Services</h2>
				<?php $crio_divider(); ?>
			</div>
		</div>
		<div class="row row-spacing-lg-bottom">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<?php $crio_icons( [
					[ 'title' => 'Advanced Analytics' ],
					[ 'title' => 'Finance' ],
					[ 'title' => 'Strategy & Marketing' ],
				] ); ?>
			</div>
		</div>
	</div>
</div>
<div class="boldgrid-section">
	<div class="container">
		<div class="row row-spacing-lg-top">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<h2 style="margin-top: 0;">Team</h2>
				<?php $crio_divider(); ?>
			</div>
		</div>
		<div class="row row-spacing-lg-bottom">
			<div class="col-md-5 col-sm-12 col-xs-12">
				<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="text-center">
							<img class="bg-img bg-img-3" src="<?php $crio_image_path( 'man-on-computer.jpg' ) ?>">
							<h4 style="margin-top: 1em; font-size: 1.2em;">Sam Wood</h4>
							<p class="">Product Management</p>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-1 col-sm-12 col-xs-12"></div>
			<div class="col-md-6 col-sm-12 col-xs-12">
				<h3 style="margin-top: 0;">Who We Are</h3>
				<p style="margin-bottom: 2em;">Generate vertical integration while remembering to increase viewability. Grow social with the aim to increase viewability. Lead vertical integration in turn innovate.</p>
				<p style="margin-bottom: 2em;">Repurpose customer jounreys with the aim to come up with a bespoken solution. Growing benchmarking so that we build ROI.</p>
				<p style="margin-bottom: 2em;">Engage benchmarking to, consequently, take this offline. Execute user experience to go viral. Funneling sprints and possibly improve overall outcomes.</p>
				<p class="" style="margin-bottom: 2em;"><a href="#" class="button-primary">Meet the Team</a></p>
			</div>
		</div>
	</div>
</div>
