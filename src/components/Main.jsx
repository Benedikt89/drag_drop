import React, {Component} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import './../App.css';
import Tasks from "./Tasks";

// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */

const move = (source, destination, droppableSourse, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSourse.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSourse.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

export const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    background: isDragging ? 'lightgreen' : 'grey',

    ...draggableStyle
});

export const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250,
});

class Main extends Component {

    state = {
        items: getItems(10),
        selected: getItems(5, 10)
    };

    id2List = {
        droppable: 'items',
        droppable2: 'selected',
    };


    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { selected: items };
            }

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({ items: result.droppable, selected: result.droppable2});
        }
    };
    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity

    render() {
        console.log('Render');
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <Tasks items={this.state.items} getItemStyle={getItemStyle}/>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <Droppable droppableId="droppable2">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <Tasks items={this.state.selected} getItemStyle={getItemStyle}/>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default Main;
