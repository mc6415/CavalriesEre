var User = JSON.parse($.cookie('user'));

var MainEntry = React.createClass({
  getInitialState: function(){
    return {
      heroes: []
    }
  },
  componentWillMount: function(){
    $.ajax({
      url: '/api/Heroes/getAll',
      data: {battletag: User.battletag},
      method: "POST",
      success: function(res){
        this.setState({heroes: res})
      }.bind(this)
    })
  },
  render: function(){

    var nodes = this.state.heroes.map(function(n, i){
      console.log(n);
      return(
        <tr key={i}>
          <td><img src={n.image} style={{height: '50%'}}/> {n.name}</td>
          <td>{n.playtime}</td>
        </tr>
      )
    })

    return(
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <td>Hero</td>
            <td>Time Played</td>
          </tr>
        </thead>
        <tbody>
          {nodes}
        </tbody>
      </table>
    );
  }
})

ReactDOM.render(
  <MainEntry />,
  document.getElementById('content')
)
