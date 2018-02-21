import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import SortableTree from '../../src';
import NodeRendererDefault from '../../src/node-renderer-default';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

const DynamicHeightContentRenderer = ({
  cache,
  parent,
  listIndex,
  ...extraProps
}) => (
  <CellMeasurer
    cache={cache}
    columnIndex={0}
    parent={parent}
    rowIndex={listIndex}
  >
    <NodeRendererDefault {...extraProps} />
  </CellMeasurer>
);

DynamicHeightContentRenderer.propTypes = {
  cache: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types,
  parent: PropTypes.shape({}).isRequired,
  listIndex: PropTypes.number.isRequired,
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        {
          title: 'Chicken',
          subtitle: (
            <span>
              The chicken (Gallus gallus domesticus) is a type of domesticated
              fowl,<br />a subspecies of the red junglefowl. It is one of the
              most common<br />and widespread domestic animals, with a total
              population of more than<br />19 billion as of 2011.<br />
              <br />Humans commonly keep chickens as a source of food<br />(consuming
              both their meat and eggs) and, more rarely, as pets.<br />
              <br />Chickens are omnivores. In the wild, they often scratch at
              the soil to<br />search for seeds, insects and even animals as
              large as lizards, small<br />snakes or young mice. The average
              chicken may live for five to ten<br />years, depending on the
              breed.<br />
              <a href="https://en.wikipedia.org/wiki/Chicken">
                &copy; wikipedia
              </a>
            </span>
          ),
          expanded: true,
          children: [
            {
              title: 'Egg',
              subtitle: (
                <span>
                  An egg is the organic vessel containing the zygote in which an
                  animal embryo<br />develops until it can survive on its own;
                  at which point the animal hatches.<br />
                  <a href="https://en.wikipedia.org/wiki/Egg">
                    &copy; wikipedia
                  </a>
                </span>
              ),
            },
          ],
        },
      ],
    };

    this.cellMeasurerCache = new CellMeasurerCache({ fixedWidth: true });
    this.recalcHeights = this.recalcHeights.bind(this);
    this.generateNodeProps = this.generateNodeProps.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleDragHover = this.handleDragHover.bind(this);
  }

  componentWillUnmount() {
    if (this.cellMeasurerCache) {
      this.cellMeasurerCache.clearAll();
    }
  }

  recalcHeights() {
    if (this.cellMeasurerCache) {
      this.cellMeasurerCache.clearAll();
    }

    if (this.list) {
      this.list.wrappedInstance.recomputeRowHeights();
    }
  }

  generateNodeProps({ listIndex, treeIndex }) {
    return {
      listIndex,
      cache: this.cellMeasurerCache,
      onHeightChange: () => this.cellMeasurerCache.clear(treeIndex, 0),
    };
  }

  handleChange(treeData) {
    this.setState({ treeData }, () => this.recalcHeights());
  }

  handleResize() {
    this.recalcHeights();
  }

  handleDragHover() {
    this.recalcHeights();
  }

  render() {
    return (
      <div style={{ height: 500 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={this.handleChange}
          onResize={this.handleResize}
          onDragHover={this.handleDragHover}
          generateNodeProps={this.generateNodeProps}
          nodeContentRenderer={DynamicHeightContentRenderer}
          dragPastCentre
          reactVirtualizedListProps={{
            ref: ref => {
              this.list = ref;
            },
            deferredMeasurementCache: this.cellMeasurerCache,
            rowHeight: this.cellMeasurerCache.rowHeight,
          }}
        />
      </div>
    );
  }
}
