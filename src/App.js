import React, { memo, useState } from "react";
import "normalize.css";
import styled from "@emotion/styled";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import documentData from "./initial-data";
import Column from "./column";

const Container = styled.div`
  display: flex;
  min-height: 200px; // needs minimum
`;

const Layout = styled.div`
`;

const Row = styled.div`
  margin: 8px;
  background-color: white;
  border: 1px solid lightgrey;
  border-radius: 2px;
  min-height: 220px;
`;

const areEqual = (prevProps, nextProps) => {
  return (
    nextProps.column === prevProps.column &&
    nextProps.itemap === prevProps.itemMap &&
    nextProps.index === prevProps.index
  );
};

const InnerList = memo(props => {
  const { column, itemMap, index } = props;
  const items = column.itemIds.map(itemId => itemMap[itemId]);
  return <Column column={column} items={items} index={index} />;
}, areEqual);

const App = () => {
  const [data, setData] = useState(documentData);

  const onDragStart = start => {};

  const onDragUpdate = update => {};

  const onDragEnd = results => {
    const { destination, source, draggableId, type } = results;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // if (type === "column") {
    //   const newColumnOrder = Array.from(data.columnOrder);
    //   newColumnOrder.splice(source.index, 1);
    //   newColumnOrder.splice(destination.index, 0, draggableId);

    //   const newState = {
    //     ...data,
    //     columnOrder: newColumnOrder
    //   };

    //   setData(newState);
    //   return;
    // }

    // Column Handling
    // TODO: check if same order
    if (type === "column") {
      const destRow = destination.droppableId;
      const sourceRow = source.droppableId;

      console.log(`destination id: ${destRow}`);
      console.log(`source id: ${sourceRow}`);

      if (destRow === sourceRow) {
        // Reorder column
        const newColumnOrder = [...data.rows[destRow].columnIds];
        newColumnOrder.splice(source.index, 1);
        newColumnOrder.splice(destination.index, 0, draggableId);

        const newState = {
          ...data,
          rows: {
            ...data.rows,
            [destRow]: {
              ...destRow,
              columnIds: newColumnOrder
            }
          }
        };

        setData(newState);
        return;
      }
      // Reparent column to new row
      const newColumnOrder = [...data.rows[destRow].columnIds];
      const oldColumnOrder = [...data.rows[sourceRow].columnIds];

      oldColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...data,
        rows: {
          ...data.rows,
          [sourceRow]: {
            ...sourceRow,
            columnIds: oldColumnOrder
          },
          [destRow]: {
            ...destRow,
            columnIds: newColumnOrder
          }
        }
      };

      setData(newState);
      return;
    }

    // Moving Items
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newitemIds = Array.from(start.itemIds);
      newitemIds.splice(source.index, 1);
      newitemIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        itemIds: newitemIds
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn
        }
      };

      setData(newState);
      return;
    }

    // Moving from one list to another.
    const startitemIds = Array.from(start.itemIds);
    startitemIds.splice(source.index, 1);
    const newStart = {
      ...start,
      itemIds: startitemIds
    };

    const finishitemIds = Array.from(finish.itemIds);
    finishitemIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      itemIds: finishitemIds
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };

    setData(newState);
  };
  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      <Layout>
        {/* Render Row */}
        { data.rowOrder.map((rowId, index) => (
          <Row key={rowId}>
            <Droppable droppableId={rowId} direction="horizontal" type="column">
              {provided => (
                <Container key={`${rowId}-${index}`}
                    {...provided.droppableProps} ref={provided.innerRef}>
                  {data.rows[rowId].columnIds.map((columnId, index) => {
                  const column = data.columns[columnId];
                    return (
                      <InnerList
                          key={column.id}
                          column={column}
                          itemMap={data.items}
                          index={index}
                      />
                    );
                  })}
                  {provided.placeholder}
                </Container>
            )}
            </Droppable>
          </Row>
        ))}
      </Layout>
    </DragDropContext>
  );
};

export default App;
