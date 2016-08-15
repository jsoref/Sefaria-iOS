'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
    Modal
} = React;

var ReaderNavigationMenu = require('./ReaderNavigationMenu');
var SearchPage           = require('./SearchPage');
var TextColumn           = require('./TextColumn');
var TextList             = require('./TextList');
var styles               = require('./Styles.js');


var ReaderPanel = React.createClass({
  propTypes: {
    interfaceLang: React.PropTypes.string.isRequired,
    Sefaria:       React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    Sefaria = this.props.Sefaria;
    return {
    	textFlow: this.props.textFlow || 'segmented', 	// alternative is 'continuous'
    	columnLanguage: this.props.columnLanguage || 'english', 	// alternative is 'hebrew' &  'bilingual'
      searchQuery: '',
      searchQueryResult: [],
      isQueryRunning: false,
      currSearchPage: 0,
      settings: {
        language:      "bilingual",
        layoutDefault: "segmented",
        layoutTalmud:  "continuous",
        layoutTanakh:  "segmented",
        color:         "light",
        fontSize:      62.5,
      },
        ReaderDisplayOptionsMenuVisible: false

    };
  },
  openReaderDisplayOptionsMenu: function () {
    if (this.state.ReaderDisplayOptionsMenuVisible == false) {
  	 this.setState({ReaderDisplayOptionsMenuVisible:  true})
  	} else {
  	 this.setState({ReaderDisplayOptionsMenuVisible:  false})}

      console.log(this.state.ReaderDisplayOptionsMenuVisible);
  },
  onQueryChange: function(query,resetQuery) {
    if (resetQuery) {
      this.setState({currSearchPage: 0});
    }

    var req = JSON.stringify(Sefaria.search.get_query_object(query,false,[],10,this.state.currSearchPage,"text"));
    this.setState({searchQueryResult:"loading"});
    fetch(Sefaria.search.baseUrl,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: req
    })
    .then((response) => response.json())
    .then((responseJson) => {
      var resultArray = responseJson["hits"]["hits"];
      this.setState({isQueryRunning: false, searchQueryResult:resultArray});
    })
    .catch((error) => {
      this.setState({isQueryRunning: false, searchQueryResult:["error"]});
    });

    this.setState({isQueryRunning: true});
  },
  search: function(query) {
    this.onQueryChange(query,true);
    this.props.openSearch();
  },
  toggleLanguage: function() {
    // Toggle current display language between english/hebrew only
    if (this.state.settings.language == "english") {
      this.state.settings.language = "hebrew";
    } else {
      this.state.settings.language = "english";
    }
    this.setState({settings: this.state.settings});
  },
  toggleTextFlow:function() {
    if (this.state.textFlow == "continuous") {
  	 this.setState({textFlow:  "segmented"})
  	} else {
  	 this.setState({textFlow:  "continuous"})

  	 if (this.state.columnLanguage == "bilingual") {
        this.setState({columnLanguage:  "hebrew"})
  	 }
  	}
  },
  togglecolumnLanguage:function() {
    switch(this.state.columnLanguage) {
      case "english":
          this.setState({columnLanguage:  "hebrew"})
          break;
      case "hebrew":
      	this.state.textFlow == "continuous" ? this.setState({columnLanguage:  "english"}) : this.setState({columnLanguage:  "bilingual"})
          break;
      case "bilingual":
          this.setState({columnLanguage:  "english"})
          break;
      default:
          this.setState({columnLanguage:  "bilingual"})
    }
  },
  render: function() {

    switch(this.props.menuOpen) {
      case (null):
        break;
      case ("navigation"):
        return (
          <ReaderNavigationMenu
            categories={this.props.navigationCategories}
            setCategories={this.props.setNavigationCategories}
            openRef={this.props.RefPressed}
            openNav={this.props.openNav}
            closeNav={this.props.closeMenu}
            openSearch={this.search}
            toggleLanguage={this.toggleLanguage}
            settings={this.state.settings}
            interfaceLang={this.props.interfaceLang}
            Sefaria={Sefaria} />);
        break;
      case ("search"):
        return(
          <SearchPage
            closeNav={this.props.closeMenu}
            onQueryChange={this.onQueryChange}
            searchQuery={this.state.searchQuery}
            loading={this.state.isQueryRunning}
            queryResult={this.state.searchQueryResult} />);
        break;
    }

    return (
  		<View style={styles.container}>
          <ReaderControls
            textReference={this.props.textReference}
            openNav={this.props.openNav}
            openReaderDisplayOptionsMenu={this.openReaderDisplayOptionsMenu}
          />
          {this.state.ReaderDisplayOptionsMenuVisible ? (<ReaderDisplayOptionsMenu
            textFlow={this.state.textFlow}
            textReference={this.props.textReference}
            columnLanguage={this.state.columnLanguage}
            ReaderDisplayOptionsMenuVisible={this.state.ReaderDisplayOptionsMenuVisible}
            toggleTextFlow={this.toggleTextFlow}
            togglecolumnLanguage={this.togglecolumnLanguage}
          />) : null }

          <View style={styles.mainTextPanel}>
            <TextColumn data={this.props.data} segmentRef={this.props.segmentRef} textFlow={this.state.textFlow} columnLanguage={this.state.columnLanguage} TextSegmentPressed={ this.props.TextSegmentPressed } />
          </View>
          <View style={styles.commentaryTextPanel}>
            <TextList data={this.props.data} segmentRef={this.props.segmentRef} textFlow={this.state.textFlow} columnLanguage={this.state.columnLanguage} RefPressed={ this.props.RefPressed } />
          </View>
        </View>);
  }
});


var ReaderControls = React.createClass({
  propTypes: {
    textReference:    React.PropTypes.string,
    openNav:  React.PropTypes.function,
    openReaderDisplayOptionsMenu:  React.PropTypes.function,
  },
  render: function() {
    return (
        <View style={styles.header}>
          <TouchableOpacity onPress={this.props.openNav}>
            <Text style={styles.headerButton}>☰</Text>
          </TouchableOpacity>

          <Text style={[{width:100}]}>
            {this.props.textReference}
          </Text>

          <TouchableOpacity onPress={this.props.openReaderDisplayOptionsMenu}>
            <Image source={require('./img/ayealeph.png')} style={styles.readerOptions} resizeMode={Image.resizeMode.contain}/>
          </TouchableOpacity>

        </View>
    );







  }
});

var ReaderDisplayOptionsMenu = React.createClass({
  propTypes: {
    textFlow:    React.PropTypes.string,
    textReference:    React.PropTypes.string,
    columnLanguage:    React.PropTypes.string,
    ReaderDisplayOptionsMenuVisible: React.PropTypes.bool,
    openNav:  React.PropTypes.function,
    toggleTextFlow:  React.PropTypes.function,
    togglecolumnLanguage:  React.PropTypes.function,
    openSearch:  React.PropTypes.function,
  },
  render: function() {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={this.props.toggleTextFlow} style={[{width:100}]}>
              <Text style={styles.title}>
                {this.props.textFlow}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.togglecolumnLanguage} style={[{width:100}]}>
              <Text style={styles.title}>
                {this.props.columnLanguage}
              </Text>
            </TouchableOpacity>
        </View>
    );







  }
});



module.exports = ReaderPanel;
