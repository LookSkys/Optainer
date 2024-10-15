import './BloqueTareas.css'

export function BloqueTareas () {
    return(
        <div className="contenedor-tareas">
            {/* Titulo de la view */}
            <h2>Tareas</h2>
            {/* Tabs con los tipos de tareas */}
            <ul class="nav nav-underline">
                <li class="nav-item">
                    <a class="nav-link active"  href="#">
                        <h6>Todas <span class="badge text-bg-secondary">20</span></h6>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active"  href="#">
                        <h6>Complejo <span class="badge text-bg-secondary">02</span></h6>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active"  href="#">
                        <h6>Normal <span class="badge text-bg-secondary">08</span></h6>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active"  href="#">
                        <h6>Simple <span class="badge text-bg-secondary">10</span></h6>
                    </a>
                </li>
            </ul>
            {/* Tareas disponibles */}
            <div class="list-group lista-tareas">
            <a href="#" class="list-group-item list-group-item-action">
                    <h6>🔴 Mover Contenedor CAIU-42325  <span class="badge text-bg-danger">En espera</span></h6>
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                    <h6>🟡 Mover Contenedor CAIU-5325  <span class="badge text-bg-warning">Pendiente</span></h6>
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                    <h6>🔴 Mover Contenedor CAIU-12125  <span class="badge text-bg-danger">En espera</span></h6>
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                    <h6>🟢 Mover Contenedor CAIU-98545  <span class="badge text-bg-success">Realizado</span></h6>
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                    <h6>🟢 Mover Contenedor CAIU-65645 <span class="badge text-bg-success">Realizado</span></h6>
                </a>
            </div>
        </div>
    )
}