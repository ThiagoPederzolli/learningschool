const fs = require('fs')
const Intl = require('Intl')
const data = require('../data.json')
const { age, date } = require('../utils')

exports.index =  function(req, res){
    return res.render('teachers/index', {teachers: data.teachers})
}
exports.create = function(req, res){
    return res.render('teachers/create')
}
//post
exports.show = function(req, res){
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })
   
    if(!foundTeacher) return res.send("Teacher not found")

    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        studies: foundTeacher.studies.split(',' ),
        created_at: Intl.DateTimeFormat("pt-br").format(foundTeacher.created_at),
    }
    return res.render("teachers/show", {teacher })
}
exports.post = function(req, res){

    const keys = Object.keys(req.body)
    for(key of keys){
        if(req.body[key] == ""){
            return res.send('Please fill all fields!')
        }
    }
    let { avatar_url, name, birth, graduate, classtype, studies } = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.teachers.length +1)

    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        graduate,
        classtype,
        studies,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error")

        return res.redirect("/teachers")
    })
    
}
exports.edit = function(req, res){
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })
   
    if(!foundTeacher) return res.send("Teacher not found")

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth).iso

    }

    return res.render('teachers/edit', {teacher})
}

exports.put = function(req, res){
    const { id } = req.body
    let index = 0

    const foundTeacher = data.teachers.find(function(teacher, foundIndex){
        if( id == teacher.id){
            index = foundIndex
            return true
        }
        
    })
   
    if(!foundTeacher) return res.send("Teacher not found")

    const teacher = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }
    data.teachers[index] = teacher

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!")

        return res.redirect(`/teachers/${id}`)
    })


}

exports.delete = function(req, res){
    const { id } = req.body

    const filteredTeachers = data.teachers.filter(function(teacher){
        return teacher.id != id        
    })
    data.teachers = filteredTeachers
    
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!")

        return res.redirect(`/teachers`)
    })

}