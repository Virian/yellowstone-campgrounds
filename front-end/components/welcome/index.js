import React from 'react'

export default class Welcome extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="welcome container">
        <h1>Yellowstone Campgrounds Fill Times</h1>
        <h3>This website provides a history of fill times of campgrounds in Yellowstone National Park. For more detailed
          information about these campgrounds visit <a href="https://www.nps.gov/yell/planyourvisit/campgrounds.htm"
                                                       target="_blank">Yellowstone official site</a>.</h3>
        <h3>All provided times are in Yellowstone local timezone - MDT (UTC-6)</h3>
      </div>
    )
  }
}
