var jsPsychLineLearning = (function (jspsych) {
  'use strict';

  const info = {
      name: "line-learning",
      parameters: {
          /** The HTML string to be displayed */
          stimulus: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Stimulus",
              default: '',
          },
          /** Array containing the label(s) for the button(s). */
          choices: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Choices",
              default: undefined,
              array: true,
          },
          /** The HTML for creating button. Can create own style. Use the "%choice%" string to indicate where the label from the choices parameter should be inserted. */
          button_html: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Button HTML",
              default: '<button class="jspsych-btn">%choice%</button>',
              array: true,
          },
          /** Any content here will be displayed under the button(s). */
          prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Prompt",
              default: null,
          },
          /** How long to show the stimulus. */
          stimulus_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Stimulus duration",
              default: null,
          },
          /** How long to show the trial. */
          trial_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Trial duration",
              default: null,
          },
          /** The vertical margin of the button. */
          margin_vertical: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Margin vertical",
              default: "0px",
          },
          /** The border around the grid. */
          border_colour: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Border colour",
              default: "transparent",
          },
            /** The size of the squares */
          square_size: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Square size",
              default: 30,
          },
               /** Category membership, should include  */
          category: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "The category memebership of the current trial",
              default: null,
          },
                /** Colours  */
          colours: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "The colours used for the stimuli",
              default: ["red", "green", "blue", "yellow"],
              array: true
          },
                /** The probabilities of a red, green, blue, and yellow square respectively */
          colour_prob: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Colour Probabilities",
              default: [35,35,15,15],
              array: true
          },
          empirical_col_probs:{
             type: jspsych.ParameterType.BOOL,
              pretty_name: "Should the colour probabilities be sampled from a distribution?",
              default: true
            },
          /** The plength of the three lines as an array from left to right */
          line_lengths: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Length of the three lines from left to right",
              default: null,
              array: true
          },
              monotonic_pallette: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Draw from the blue or red pallete on the monotonic label category?",
              default: null,
              array: false
          },
            /** The vertical spacing between the squares */
              square_closeness: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Vertical spacing between rows",
              default: 3
          },
          /** Set a border around the grid */
           grid_border: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Adds a border around the grid",
              default: "solid black"
           },
          /** The horizontal margin of the button. */
          margin_horizontal: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Margin horizontal",
              default: "8px",
          },
          /** If true, then trial will end when user responds. */
          response_ends_trial: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Response ends trial",
              default: true,
          },
      },
  };

  class LineLearningPlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {


//



// make the grid
        trial.stimulus = `
        <div style  = "margin-top: 20px; padding-top: 20px; margin-bottom: 20px; padding-bottom: 20px; padding-right: 20px; margin-right:20px; padding-left: 20px; margin-left:20px;" class = "containerclass">
    <div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row1 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row2 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row3 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row4 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row5 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row6 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row7 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row8 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row9 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row10 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row11 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row12 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row13 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row14 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row15 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row16 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row17 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row18 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row19 col20 square"></div>
</div>
<div style = "margin-bottom: -`+ trial.square_closeness + `px;">
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col1 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col2 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col3 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col4 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col5 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col6 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col7 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col8 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col9 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col10 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col11 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col12 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col13 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col14 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col15 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col16 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col17 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col18 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col19 square"></div>
<div style = "width: ` + trial.square_size + `px; height: ` + trial.square_size + `px; display: inline-block; border: .0001px dotted ` + trial.border_colour + `;" class="row20 col20 square"></div>
</div></div>`





          var html = '<div id="jspsych-html-button-response-stimulus">' + trial.stimulus + "</div>";
          //display buttons
          var buttons = [];
          if (Array.isArray(trial.button_html)) {
              if (trial.button_html.length == trial.choices.length) {
                  buttons = trial.button_html;
              }
              else {
                  console.error("Error in Line learning plugin. The length of the button_html array does not equal the length of the choices array");
              }
          }
          else {
              for (var i = 0; i < trial.choices.length; i++) {
                  buttons.push(trial.button_html);
              }
          }
          html += '<div id="jspsych-html-button-response-btngroup">';
          for (var i = 0; i < trial.choices.length; i++) {
              var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
              html +=
                  '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:' +
                      trial.margin_vertical +
                      " " +
                      trial.margin_horizontal +
                      '" id="jspsych-html-button-response-button-' +
                      i +
                      '" data-choice="' +
                      i +
                      '">' +
                      str +
                      "</div>";
          }
          html += "</div>";
          //show prompt if there is one
          if (trial.prompt !== null) {
              html += trial.prompt;
          }
          display_element.innerHTML = html;
          // start time
          var start_time = performance.now();
          // add event listeners to buttons
          for (var i = 0; i < trial.choices.length; i++) {
              display_element
                  .querySelector("#jspsych-html-button-response-button-" + i)
                  .addEventListener("click", (e) => {
                  var btn_el = e.currentTarget;
                  var choice = btn_el.getAttribute("data-choice"); // don't use dataset for jsdom compatibility
                  after_response(choice);
              });
          }



///////////////////////////////////////
          // Make the lines
///////////////////////////////////////


// Randomly select a category
var category  = trial.category;



// Select the columns to show
var col_to_show1 = jsPsych.randomization.randomInt(1, 16);
var col_to_show2 = jsPsych.randomization.randomInt(col_to_show1 + 2, 18);
var col_to_show3 = jsPsych.randomization.randomInt(col_to_show2 + 2, 20);


// Set lengths
var line_lengths = trial.line_lengths;
var line_lengths = line_lengths.sort(function(a, b){return a - b});


// Pull out the max and min
var extremes = jsPsych.randomization.sampleWithoutReplacement([line_lengths[0], line_lengths[2]],2);

// if category is Mono then arrange in a monotonic order
if(category == "Mono"){
var line_length1 = extremes[0];
var line_length2 = line_lengths[1];
var line_length3 = extremes[1];
}


if(category != "Mono"){
var extras = jsPsych.randomization.sampleWithoutReplacement([extremes[1],line_lengths[1]],2)
var line_length1 = extras[0];
var line_length2 = extremes[0];
var line_length3 = extras[1];
}


// Now we have the lengths we need to choose a row to start from and then light up the correct number in that column

// Sets the first row at random (ensuring doesn't exceed 20)
var y_start1 = jsPsych.randomization.sampleWithoutReplacement(Array(21 - line_length1).fill().map((element, index) => index + 1), 1) 
var y_start2 = jsPsych.randomization.sampleWithoutReplacement(Array(21 - line_length2).fill().map((element, index) => index + 1), 1) 
var y_start3 = jsPsych.randomization.sampleWithoutReplacement(Array(21 - line_length3).fill().map((element, index) => index + 1), 1) 

// Defines the full set of rows to light up
var rows_line1 = Array(line_length1).fill().map((element, index) => index + parseInt(y_start1)) 
var rows_line2 = Array(line_length2).fill().map((element, index) => index + parseInt(y_start2)) 
var rows_line3 = Array(line_length3).fill().map((element, index) => index + parseInt(y_start3)) 

// Adds the word 'row' infront of the row number
for(var i=0;i<rows_line1.length;i++){
    rows_line1[i]="row"+rows_line1[i];
}

for(var i=0;i<rows_line2.length;i++){
    rows_line2[i]="row"+rows_line2[i];
}

for(var i=0;i<rows_line3.length;i++){
    rows_line3[i]="row"+rows_line3[i];
}


  // Create an array with exact number of each value
  // Probably could just sample with probabilities, but sticking with the paper method for now



// Need to reverse the probabilities to get the probabilities for the non-monotonic pallette


var sum = trial.line_lengths.reduce((accumulator, currentValue) => {
  return accumulator + currentValue
},0);



  if(trial.empirical_col_probs == true) {
  var colour_array = jsPsych.randomization.sampleWithReplacement(trial.colours, sum, trial.colour_prob)
}



  if(trial.empirical_col_probs == false) {
  var eprobs = [Math.round(sum*trial.colour_prob[0]/100), Math.round(sum*trial.colour_prob[1]/100), Math.round(sum*trial.colour_prob[2]/100), Math.round(sum*trial.colour_prob[3]/100)]
  var colour_array = jsPsych.randomization.repeat(trial.colours, eprobs, false)

}




// Loop through the rows and light them up if they appear in the above arrays
var squares = document.getElementsByClassName('col' + col_to_show1);
i = 0;

for (var square of squares) {
  rows_line1.forEach(function(entry) {
    if( square.classList.contains(entry)){
     
      // Set the colour
      square.style.backgroundColor = colour_array[i];

       i = i + 1;
      

    }
  
  });}



var squares = document.getElementsByClassName('col' + col_to_show2);


for (var square of squares) {
  rows_line2.forEach(function(entry) {
    if( square.classList.contains(entry)){
     
      // Set the colour
      square.style.backgroundColor = colour_array[i];

       i = i + 1;
      

    }
  
  });}


var squares = document.getElementsByClassName('col' + col_to_show3);


for (var square of squares) {
  rows_line3.forEach(function(entry) {
    if( square.classList.contains(entry)){
     
      // Set the colour
      square.style.backgroundColor = colour_array[i];

       i = i + 1;
      

    }
  
  });}



// Add the border if desired
var content = document.getElementsByClassName('containerclass');

for (var rows of content) {
rows.style.border = trial.grid_border;
}






          // store response
          var response = {
              rt: null,
              button: null,
          };
          // function to end trial when it is time
          const end_trial = () => {
              // kill any remaining setTimeout handlers
              this.jsPsych.pluginAPI.clearAllTimeouts();

              // Score the trial
              trial.accuracy = 0;
              if((trial.choices[response.button] == trial.monotonic_label | trial.choices[response.button] == trial.conf_monotonic_label) & trial.category == "Mono"){trial.accuracy = 1}
              if(trial.choices[response.button] != trial.monotonic_label & trial.choices[response.button] != trial.conf_monotonic_label & trial.category != "Mono"){trial.accuracy = 1}

             

              if(response.button == null){trial.accuracy = 0};
              
              // gather the data to store for the trial
              var trial_data = {
                  rt: response.rt,
                  stimulus: "Line",
                  category: trial.category,
                  response: response.button,
                  options: trial.choices,
                  choice: trial.choices[response.button],
                  accuracy: trial.accuracy,
                  line_lengths: [line_length1,line_length2,line_length3],
                  colour_prob: trial.colour_prob
              };
              // clear the display
              display_element.innerHTML = "";
              // move on to the next trial
              this.jsPsych.finishTrial(trial_data);
          };
          // function to handle responses by the subject
          function after_response(choice) {
              // measure rt
              var end_time = performance.now();
              var rt = Math.round(end_time - start_time);
              response.button = parseInt(choice);
              response.rt = rt;
              // after a valid response, the stimulus will have the CSS class 'responded'
              // which can be used to provide visual feedback that a response was recorded
              display_element.querySelector("#jspsych-html-button-response-stimulus").className +=
                  " responded";
              // disable all the buttons after a response
              var btns = document.querySelectorAll(".jspsych-html-button-response-button button");
              for (var i = 0; i < btns.length; i++) {
                  //btns[i].removeEventListener('click');
                  btns[i].setAttribute("disabled", "disabled");
              }
              if (trial.response_ends_trial) {
                  end_trial();
              }
          }
          // hide image if timing is set
          if (trial.stimulus_duration !== null) {
              this.jsPsych.pluginAPI.setTimeout(() => {
                  display_element.querySelector("#jspsych-html-button-response-stimulus").style.visibility = "hidden";
              }, trial.stimulus_duration);
          }
          // end trial if time limit is set
          if (trial.trial_duration !== null) {
              this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
          }
      }
      simulate(trial, simulation_mode, simulation_options, load_callback) {
          if (simulation_mode == "data-only") {
              load_callback();
              this.simulate_data_only(trial, simulation_options);
          }
          if (simulation_mode == "visual") {
              this.simulate_visual(trial, simulation_options, load_callback);
          }
      }
      create_simulation_data(trial, simulation_options) {
          const default_data = {
              stimulus: trial.stimulus,
              rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
              response: this.jsPsych.randomization.randomInt(0, trial.choices.length - 1),
          };
          const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
          this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
          return data;
      }
      simulate_data_only(trial, simulation_options) {
          const data = this.create_simulation_data(trial, simulation_options);
          this.jsPsych.finishTrial(data);
      }
      simulate_visual(trial, simulation_options, load_callback) {
          const data = this.create_simulation_data(trial, simulation_options);
          const display_element = this.jsPsych.getDisplayElement();
          this.trial(display_element, trial);
          load_callback();
          if (data.rt !== null) {
              this.jsPsych.pluginAPI.clickTarget(display_element.querySelector(`div[data-choice="${data.response}"] button`), data.rt);
          }
      }
  }
  LineLearningPlugin.info = info;

  return LineLearningPlugin;

})(jsPsychModule);
