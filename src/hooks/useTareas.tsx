import { useShallow } from "zustand/shallow"
import { tareaStore } from "../store/tareaStore"
import { ITarea } from "../types/ITarea"
import { editarTarea, eliminarTareaPorID, getAllTareas, postNuevaTarea } from "../http/tareas"
import Swal from "sweetalert2"

export const useTareas = () => {
    const {tareas, setArrayTareas, agregarNuevaTarea, eliminarUnaTarea, editarUnaTarea}= tareaStore(
        useShallow((state)=>({
            tareas: state.tareas,
            setArrayTareas: state.setArrayTareas,
            agregarNuevaTarea: state.agregarNuevaTarea,
            eliminarUnaTarea: state.eliminarUnaTarea,
            editarUnaTarea: state.editarUnaTarea,
        }))
    )

    const getTareas = async () => {
        const data = await getAllTareas();
        if (data) setArrayTareas(data);
    }

    const crearTarea = async (nuevaTarea:ITarea)=> {
        agregarNuevaTarea(nuevaTarea);
        try{
            await postNuevaTarea(nuevaTarea);
            Swal.fire("Exito","Tarea creada correctamente","success")
        }catch(error){
            eliminarUnaTarea(nuevaTarea.id!);
            console.log("tarea salio mal");
        }
    };

    const putTareaEditar = async (tareaEditada: ITarea) => {

        const estadoPrevio = tareas.find((el)=>el.id === tareaEditada.id)

        editarUnaTarea(tareaEditada)

        try {
            await editarTarea(tareaEditada)
            Swal.fire("Exito","Tarea actualizada correctamente","success")
        } catch (error) {
            if (estadoPrevio) editarUnaTarea(estadoPrevio);
            console.log("editar tarea salio mal");
        }
    }

    const eliminarTarea = async (idTarea: string) => {
        const estadoPrevio = tareas.find((el)=> el.id === idTarea);

        const confirm = await Swal.fire({
            title: "Estas seguro?",
            text: "Esta accion no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        })

        if(!confirm.isConfirmed) return;

        eliminarUnaTarea(idTarea)
        try {
            await eliminarTareaPorID(idTarea);
            Swal.fire("Eliminado","Tarea eliminada correctamente","success")
        } catch (error) {
            if (estadoPrevio) agregarNuevaTarea (estadoPrevio);
            console.log("eliminar tarea salio mal")
        }
    }

    return {
        getTareas,
        crearTarea,
        putTareaEditar,
        eliminarTarea,
        tareas,
    }
}
