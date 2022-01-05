const { db } = require("./cnn")

const pizzaResolver={
    Query:{
        async pizzas(root,{name}){

           console.log(name)
           if(name==undefined){
            const result= await db.any('select * from pizza order by piz_id asc')
            console.log(result)
            return result
           }else{
            return await db.any('select * from pizza where piz_name=$1',[name])
           }
        },async pizzasId(root,{id}){
            return await db.any('select * from pizza where piz_id=$1',[id])
        }

    },pizza:{
        async ingredientes(pizza){
            return  await db.any(`select ing.* from ingrediente ing, pizza_ingredient piz
            where ing.ing_id=piz.ing_id and piz.piz_id=$1`,[pizza.piz_id])
        }
    },Mutation:{        
        async createPizza(root,{pizza}){
            if(pizza == undefined)
                return null
            else{
                const sql=`INSERT INTO public.pizza(piz_name, piz_origin, piz_state)
                        VALUES ($1, $2, $3) RETURNING*;`
                const resut= await db.one(sql,[pizza.piz_name,pizza.piz_origin,pizza.piz_state])
                ///ingresar ingrediente 
                if(pizza.ingredientes && pizza.ingredientes.lengt >0)
                pizza.ingredientes.forEach(ing_id => {
                    const sql=` INSERT INTO public.ingrediente(
                         ing_name, ing_calories, ing_state)
                        VALUES ($1, $2, true); RETURNING*; `
                        db.one(sql,[resut.piz_id.ing_id])
                });

                return resut
            }
            
        },
        async updatePizza(root,{pizza}){
            if(pizza == undefined)
            return null
            else{
                const sql= `UPDATE public.pizza
                SET  piz_name=$2, piz_origin=$3, piz_state=$4
                WHERE piz_id=$1 RETURNING*;`
                const resut= await db.one(sql,[pizza.piz_id,pizza.piz_name,pizza.piz_origin,pizza.piz_state])
                return resut
            }
    },
    async deletePizza(root,{pizza}){
            if(pizza == undefined)
        return null
        else{
            const sql =`UPDATE pizza SET piz_state=false where piz_id=$1  RETURNING*; `
            const resut= await db.one(sql,[pizza.piz_id])
                return resut
        }
    }
}

}

module.exports=pizzaResolver


