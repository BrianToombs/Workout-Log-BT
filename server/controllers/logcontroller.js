const Express = require('express');
const router = Express.Router();
const validateJWT = require('../middleware/validate-jwt');

const {WorkoutLog} = require('../models')

router.get('/practice', validateJWT, (req, res) => {
    res.send('Hey!! This is a practice route!')
});

/*
=========================
    WorkoutLog Create
=========================
*/
router.post('/create', validateJWT, async (req, res) => {
    const {title, date, entry} = req.body.workout;
    const {id} = req.user;
    const workoutEntry = {
        title,
        date,
        entry,
        owner: id
    }
    try {
        const newWorkoutLog = await WorkoutLog.create(workoutEntry);
        res.status(200).json(newWorkoutLog);
    } catch (err) {
        res.status(500).json({error: err});
    } 
});

/*
=========================
   Get All WorkoutLogs
=========================
*/
router.get('/', async (req, res) => {
    try {
        const entries = await WorkoutLog.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({error:err});
    }
});

/*
=========================
 Get WorkoutLogs by User
=========================
*/
router.get('/mine', validateJWT, async (req, res) => {
    let {id} = req.user;
    console.log(id)
    try {
        const userLogs = await WorkoutLog.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/*
==========================
 Get WorkoutLogs by Title
==========================
*/
router.get('/:title', async (req, res) => {
    const {title} = req.params;
    try {
        const results = await WorkoutLog.findAll({
            where: {title: title}
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({error: err});
    }
});


/*
==========================
Update a WorkoutLogs Entry
==========================
*/
router.put('/update/:entryId', validateJWT, async (req, res) => {
    const{title, date, entry} = req.body.workout;
    const workoutId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: workoutId,
            owner: userId
        }
    };
    const updatedWorkout = {
        title: title,
        date: date,
        entry: entry,
    };

    try {
        const update = await WorkoutLog.update(updatedWorkout, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/*
==========================
Update a WorkoutLogs Entry
==========================
*/
router.delete('/delete/:id', validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const journalId = req.params.id;

    try {
        const query = {
            where: {
                id: journalId,
                owner: ownerId
            }
        };

        await WorkoutLog.destroy(query);
        res.status(200).json({message: "Workout Entry Removed"});
    } catch (err) {
        res.status(500).json({error: err});
    }
});


router.get('/about', (req, res) => {
    res.send("This is the about route!");
});

module.exports = router;