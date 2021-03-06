'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Alert,
  SwipeableFlatList,
  FlatList,
  Image,
} from 'react-native';
import {
  CategoryColorLine,
  CategorySideColorLink,
  DirectedButton,
  TwoBox,
  LanguageToggleButton,
  AnimatedRow,
  SText,
} from './Misc.js';

import styles from './Styles';
import strings from './LocalizedStrings';


class SwipeableCategoryList extends React.Component {
  static propTypes = {
    close:              PropTypes.func.isRequired,
    theme:              PropTypes.object.isRequired,
    themeStr:           PropTypes.string.isRequired,
    toggleLanguage:     PropTypes.func.isRequired,
    openRef:            PropTypes.func.isRequired,
    language:           PropTypes.oneOf(["english","hebrew"]),
    interfaceLang:      PropTypes.oneOf(["english","hebrew"]),
    data:               PropTypes.array.isRequired,
    onRemove:           PropTypes.func.isRequired,
    title:              PropTypes.string.isRequired,
    menuOpen:           PropTypes.oneOf(["saved", "history"]),
  };

  constructor(props) {
    super(props);
    this._rowRefs = {};
  }

  removeItem = (item) => {
    const ref = this._rowRefs[item.ref];
    if (ref) {
      ref.remove();
    }
  }

  _getRowRef = (ref, item) => {
    this._rowRefs[item.ref] = ref;
  }

  renderDeleteButton = ({ item }) => (
    <View style={[{flex:1}, this.props.theme.secondaryBackground]}>
      <TouchableOpacity onPress={() => { this.removeItem(item); }} style={{alignSelf: 'flex-end', justifyContent: 'center', flex:1, width:90}}>
        <Text style={[{textAlign: 'center'}, this.props.theme.contrastText]}>
          {strings.remove}
        </Text>
      </TouchableOpacity>
    </View>
  );

  renderRow = ({ item }) => (
      <AnimatedRow
        ref={ref => { this._getRowRef(ref, item); }}
        animationDuration={250}
        onRemove={() => { this.props.onRemove(item); }}
        style={{flex: 1, justifyContent: "center", alignItems: "center"}}
      >
        <CategorySideColorLink
          theme={this.props.theme}
          themeStr={this.props.themeStr}
          category={item.category}
          enText={item.ref}
          heText={item.heRef}
          language={this.props.language}
          onPress={this.props.openRef.bind(null, item.ref, null, item.versions)}
        />
      </AnimatedRow>
  );

  _keyExtractor = (item, index) => (
    item.ref
  );

  render() {
    const FlatListClass = this.props.menuOpen === "history" ? FlatList : SwipeableFlatList;  // disable swiping on history
    const isWhite = this.props.themeStr === "white";
    const isHeb = this.props.interfaceLang === "hebrew";
    return (
      <View style={[styles.menu, this.props.theme.menu]}>
        <CategoryColorLine category={"Other"} />
        <View style={[styles.header, this.props.theme.header]}>
          <DirectedButton
            onPress={this.props.close}
            themeStr={this.props.themeStr}
            imageStyle={[styles.menuButton, styles.directedButton]}
            direction="back"
            language="english"/>
          <View style={{flex:1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <Image source={this.props.icon}
              style={[styles.menuButton, isHeb ? styles.headerIconWithTextHe : styles.headerIconWithTextEn]}
              resizeMode={'contain'}
            />
            <SText
              lang={this.props.interfaceLang}
              style={[styles.textTocHeaderTitle, {flex:0},styles.noPadding, this.props.theme.text]}>
              {this.props.title.toUpperCase()}
            </SText>
          </View>
          <LanguageToggleButton
            theme={this.props.theme}
            toggleLanguage={this.props.toggleLanguage}
            language={this.props.language}
            themeStr={this.props.themeStr}
          />
        </View>

        <FlatListClass
          data={this.props.data}
          renderItem={this.renderRow}
          keyExtractor={this._keyExtractor}
          bounceFirstRowOnMount={!Sefaria._hasSwipeDeleted}
          maxSwipeDistance={90}
          renderQuickActions={this.renderDeleteButton}
          language={this.props.language}
        />
      </View>
    );
  }
}

export default SwipeableCategoryList;
