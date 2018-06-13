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
        <h4>All provided times are in Yellowstone local timezone. If there is no information about the
          fill time on given day, it means that the campground either didn't fill or was closed.</h4>
        <h4>The website updates every midnight (Yellowstone local timezone). </h4>
      </div>
    )
  }
}
