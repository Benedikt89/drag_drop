import React, {Component} from 'react';
import { Draggable } from "react-beautiful-dnd";
import './../App.css';
import {getItemStyle} from "./Main";


class Tasks extends Component {

    render() {
        let
            tasks = this.props.items.map((item, index) =>
                <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                            )}>
                            {item.content}
                        </div>
                    )}
                </Draggable>
            );

        return (
            <div>
                {tasks}
            </div>
        )
    }
}

export default Tasks;
