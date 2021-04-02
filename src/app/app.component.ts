import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map, take, tap } from 'rxjs/operators';

export class Numero {
  numero: number;
  nombre: string;
  array: any[];
  objeto: any;

  constructor( obj: {
    number: number;
    name: string;
    arr: any[];
    obj: any;
  } ) {
    if ( !obj ) { return; }

    this.linkProp( 'numero', obj.number );
    this.linkProp( 'nombre', obj.name );
    this.linkProp( 'array', obj.arr );
    this.linkProp( 'objeto', obj.obj );
  }

  linkProp( classProp: string, objProp: any ) {
    this[ classProp ] = this.checkProp( objProp );
  }

  checkProp( val ) {
    if ( typeof val === 'string' ) {
      return val.length > 0 ? val : '';
    } else
      if ( Array.isArray( val ) ) {
        return val.length > 0 ? val : [];
      } else
        if ( typeof val === 'object' && val !== null ) {
          return Object.keys( val ).length > 0 ? val : null;
        } else
          if ( typeof val === 'number' ) {
            return val;
          } else {
            return val;
          }
  }
}

enum Paths {
  cinco = 'example.uno.dos.tres.cuatro.cinco',
  seis = 'example.uno.dos.tres.cuatro.cinco.seis',
  siete = 'example.uno.dos.tres.cuatro.cinco.seis.siete'
}

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
} )
export class AppComponent {

  example = {
    uno: {
      dos: {
        tres: {
          cuatro: {
            cinco: {
              seis: {
                siete: 777
              }
            }
          }
        }
      }

    }
  };

  arr = [ { a: 'a' }, { b: 'b' }, { c: 'c' } ]

  endpoints = {
    array: {
      url: 'https://api.mocki.io/v1/225744fa',
      method: 'get',
      path: 'data',
      classMap: {
        res: Numero,
        req: null
      }
    },
    objeto: {
      url: 'https://api.mocki.io/v1/eee55fd6',
      method: 'post',
      path: 'data',
      classMap: {
        res: Numero,
        req: null
      }
    }
  }

  constructor( private http: HttpClient ) {

    this.callSrv( this.endpoints.array )
    this.callSrv( this.endpoints.objeto )

    this.searchIn( this, Paths.cinco );
    this.searchIn( this, Paths.seis );
    this.searchIn( this, Paths.siete );
  }

  callSrv( obj ) {
    this.http.get( obj.url )
      .pipe(
        map( response => {
          const data = obj.path.length > 0 ? this.searchIn( response, obj.path ) : obj;
          return Array.isArray( this.searchIn( response, obj.path ) )
            ? data.map( el => new obj.classMap.res( el ) )
            : new obj.classMap.res( data );
        } )
      )
      .pipe(
        take( 1 )
      )
      .subscribe( el => {
        console.log( 'subscrito', el );
      } )
  }

  /**
   * @param obj Objeto en el que buscar la propiedad
   * @param path ruta a buscar en el objeto
   * @returns el valor de la ruta buscada en el objeto
   * @example searchIn({uno: {dos: 2}}, 'uno.dos') => 2
   */
  searchIn( obj, path ) {
    let res;
    const pathSplitted =
      typeof path === 'string'
        ? path.split( '.' )
        : path;
    if ( pathSplitted.length === 0 || !obj ) { return; }
    pathSplitted.forEach( ( el, idx ) => {
      return idx === 0 ? res = obj[ el ] : res = res[ el ];
    } );
    return res;
  }

  removeDuplicateds( arr: any[], propCompare: string ) {
    const arrayUniqueByKey = [ ...new Map( arr.map( item =>
      [ item[ propCompare ], item ] ) ).values() ];
    return arrayUniqueByKey;
  }

}


