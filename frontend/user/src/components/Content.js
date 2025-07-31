import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import '../style/Content.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Content = () => {
    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + '/api/getcontest');
                if (response.data.success) {
                    setCompetitions(response.data.contests);
                } else {
                    setCompetitions([]);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách cuộc thi:', error);
                setCompetitions([]);
            }
        };

        fetchContests();
    }, []);

    // Cấu hình Slider tùy theo số lượng cuộc thi
    const settings = {
        dots: competitions.length > 1,         // Chỉ bật dots nếu có > 1 slide
        infinite: competitions.length > 1,     // Tắt infinite nếu chỉ có 1
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: competitions.length > 1,     // Tắt autoplay nếu chỉ có 1
        autoplaySpeed: 3000,
    };

    return (
        <div className="rounded-start-4 container" style={{ height: '88vh', backgroundColor: '#E8E8E8' }}>
            <h5>Cuộc thi đang diễn ra</h5>
            {competitions.length > 0 ? (
                <Slider {...settings}>
                    {competitions.map((contest, index) => (
                        <div key={index} className="contest-slide">
                            <h6>{contest.contestName}</h6>
                            <p>{contest.description}</p>
                            <img src={contest.image} alt={contest.contestName} />
                        </div>
                    ))}
                </Slider>
            ) : (
                <p>Không có cuộc thi nào đang diễn ra</p>
            )}
        </div>
    );
};

export default Content;
